// Utilities
var Utilities = (function () {

    // Gets the length necessary to represent a decimal number in binary.
    // example: 10 would come back as 4 because binary 1010
    function getBitLength(keyCount) {
        var i = 0;

        while (Math.pow(2, i) < keyCount) {
            i++;
        }

        return i;
    }

    // Converts a bitArray into a decimal number.
    // example: [1,0,1,0] becomes 10
    function toDecimal(bitArray) {
        var rtn = 0,
            i = 0;

        for (i = 0; i < bitArray.length; i++) {
            if (bitArray[bitArray.length - i - 1] === 1) {
                rtn += Math.pow(2, i);
            }
        }

        return rtn;
    }

    // Provides a mechanism for ready arrays sequentially.
    function readArray(array) {
        var arr = array,
            current = 0;

        return {
            currentPos: function () {
                return current;
            },
            next: function (count) {
                var i = 0,
                    rtn = [];

                for (i = 0; i < count; i++) {
                    rtn[i] = arr[current + i];
                }

                current += count;

                return rtn;
            },
            endOfArray: function () {
                return (current >= arr.length)
            }
        }
    }

    // Builds the buttons on the screen.
    function resetDisplay() {
        document.body.innerHTML = '';
        document.writeln('<button onclick="BinaryExample.run()">Binary</button>');
        document.writeln('<button onclick="Knapsack.run()">Knapsack</button>');
        document.writeln('<button onclick="Generator.run()">Generator</button>');
    }

    return {
        getBitLength: getBitLength,
        toDecimal: toDecimal,
        readArray: readArray,
        resetDisplay: resetDisplay
    };
})();

// Genetics
var Genetics = (function (utils) {
    var currentIndividuals = [],
        currentSolution1 = [],
        currentFitness1 = 0,
        currentSolution2 = [],
        currentFitness2 = 0,
        bestSolution = [],
        bestFitness = 0,
        currentGeneration = 0,
        foundinXGenerations = 0,
        solutionSize = 40,
        populationSizeMax = 1000,
        mutationRate = 1,
        maxGenerations = 1000,
        foundSolution = false,
        findFitness,
        interpretSolution;

    // Takes the top two solutions and builds a population from them using mating.
    function generatePopulation() {
        var i = 0;

        currentIndividuals = [];

        for (i = 0; i < populationSizeMax; i++) {
            currentIndividuals[i] = mate(currentSolution1, currentSolution2);
        }
    }

    // Takes two solutions and generates a single offspring.
    function mate(in1, in2) {
        var i = 0;
        var offspring = [];
        var bitValue = 0;
        var split = Math.round((Math.random() * 1000) % solutionSize);
        
        // EXAMPLE: Not randomizing the split.
        //split = (solutionSize / 2);
        
        for (i = 0; i < solutionSize; i++) {
            bitValue = 0;

            if (i < split) {
                bitValue = in1[i];
            } else {
                bitValue = in2[i];
            }

            if ((Math.random() * 1000) % 100 <= mutationRate) {
                if (bitValue === 0) {
                    bitValue = 1;
                } else {
                    bitValue = 0;
                }
            }

            offspring[i] = bitValue;
        }

        return offspring;
    }

    // Iterates over the population to find the individuals with the
    // highest fitness and stores them for later operations.
    function findNewParents() {
        var i = 0,
            currFit1 = 0,
            currInd1 = [],
            currFit2 = 0,
            currInd2 = [],
            testFit = {};

        for (i = 0; i < currentIndividuals.length; i++) {
            testFit = findFitness(currentIndividuals[i]);

            if (testFit.value > currFit1) {
                currFit1 = testFit.value;
                currInd1 = currentIndividuals[i];
                //console.log(interpretSolution(currInd1));
            }

            if ((testFit.value > currFit2 && testFit.value < currFit1) || (currInd2.length == 0 && i > 0)) {
                currFit2 = testFit.value
                currInd2 = currentIndividuals[i];
            }

            if (testFit.value > bestFitness) {
                foundinXGenerations = currentGeneration;
                bestFitness = testFit.value;
                bestSolution = currentIndividuals[i];
            }

            if (testFit.perfect) {
                foundSolution = true;
            }
        }

        currentSolution1 = currInd1;
        currentFitness1 = currFit1;
        currentSolution2 = currInd2;
        currentFitness2 = currFit2;
    }

    // Creates a full population of entirely random individuals.
    function generateInitialPopulation() {
        var i = 0;

        currentIndividuals = [];

        for (i = 0; i < populationSizeMax; i++) {
            currentIndividuals[i] = createRandomSolution();
        }
    }

    // Creates a single random individual.
    function createRandomSolution() {
        var i = 0,
            solution = [];

        for (i = 0; i < solutionSize; i++) {
            solution[i] = (Math.floor((Math.random() * 100) % 2));
        }

        return solution;
    }

    // Begins the processing to find a solution.
    function run() {
        utils.resetDisplay();
        document.write('<pre>');
        var i = 0,
            start = new Date(),
            end = new Date();

        generateInitialPopulation();
        findNewParents();

        for (i = 0; i < maxGenerations && !foundSolution; i++) {
            currentGeneration++;
            generatePopulation();
            findNewParents();
        }

        end = new Date();
        document.write('Solution: ');
        var sol = interpretSolution(bestSolution);
        if (sol.english) {
            document.write(sol.english);
        } else {
            document.write(sol);
        }
        document.write('<br/>');
        document.write('Array: ' + bestSolution);
        document.write('<br/>');
        document.write('Fitness: ' + bestFitness);
        document.write('<br/>');
        document.write('Found in ' + foundinXGenerations + ' Generations');
        document.write('<br/>');
        document.write((end - start) + ' milliseconds');
        document.write('</pre>');

        return bestSolution;
    }

    // Resets all values back to default and sets passed configuration.
    function init(config) {
        currentIndividuals = [];
        currentSolution1 = [];
        currentFitness1 = 0;
        currentSolution2 = [];
        currentFitness2 = 0;
        currentGeneration = 0;
        bestSolution = [];
        bestFitness = 0;
        foundinXGenerations = 0;
        solutionSize = 40;
        populationSizeMax = 1000;
        mutationRate = 1;
        maxGenerations = 1000;
        foundSolution = false;
        findFitness = config.fitness;
        interpretSolution = config.interpret;
        solutionSize = config.solutionSize || 40;
        populationSizeMax = config.populationMax || 100;
        mutationRate = config.mutationRate || 1;
        maxGenerations = config.maxGenerations || 100;
        foundSolution = false;

        return run();
    }

    return {
        initialize: init
    };
}(Utilities));

// Binary Example
var BinaryExample = (function (gen, utils) {

    // Tries to find an array that contains a specific number of bits.
    function findFitness(solution) {
        var fitness = 0,
            i = 0,
            desiredBits = 2; // 10

        for (var i = 0; i < solution.length; i++) {
            fitness += solution[i];
        }

        return {
            value: 1 / Math.abs(fitness - desiredBits),
            perfect: (fitness == desiredBits)
        };
    }

    // No interpretation needed, just a simple bit array.
    function interpret(solution) {
        return solution;
    }

    function run() {
        gen.initialize({
            fitness: findFitness,
            interpret: interpret,
            solutionSize: 20,
            maxGenerations: 1000
        });
    }


    return {
        run: run
    };

}(Genetics, Utilities));

// Knapsack Example
var Knapsack = (function (gen, utils) {
    // Problem: Given that I can only carry a certain amount of weight
    // in my backpack and I have a list of items that are desired with weights
    // totalling greater than my weight limit and each item has a priority.
    // Which items should I take to optimize my backpacks contents?

    // List of potential items.
    var items = [{
        name: 'flashlight',
        weight: 5,
        priority: 5
    },
    {
        name: 'bedroll',
        weight: 20,
        priority: 20
    },
    {
        name: 'canteen',
        weight: 5,
        priority: 10
    },
    {
        name: 'truck',
        weight: 10000,
        priority: 10000
    },
    {
        name: 'toothbrush',
        weight: 1,
        priority: 1 // 50
    },
    {
        name: 'pillow',
        weight: 10,
        priority: 1
    },
    {
        name: 'widget',
        weight: 13,
        priority: 1
    },
    {
        name: 'bug net',
        weight: 10,
        priority: 1
    },
    {
        name: 'tent',
        weight: 15,
        priority: 10
    },
    {
        name: 'air matress',
        weight: 5,
        priority: 100
    },
    {
        name: 'blanket',
        weight: 10,
        priority: 4
    },
    {
        name: 'water',
        weight: 30,
        priority: 100
    },
    {
        name: 'bug spray',
        weight: 5,
        priority: 1
    },
    {
        name: 'wood',
        weight: 30,
        priority: 15
    },
    {
        name: 'food',
        weight: 10,
        priority: 100
    }];

    // weight limit
    var maxWeight = 100;

    // Determine the total weight of the solution.
    // If the weight is greater than max then sort.
    function findFitness(solution) {
        var sol = interpret(solution);

        var fitness = sol.totalWeight;

        if (sol.totalWeight > maxWeight) {
            fitness *= -1;
        } else {
            fitness += sol.totalPriority;
        }

        return {
            value: fitness,
            perfect: false
        };
    }

    // Returns:
    // the total weight of the solution
    // an array of the items
    // an english description of the items
    function interpret(solution) {
        var backpackItems = [];
        var leftItems = [];
        var possibleWeight = 0;
        var totalWeight = 0;
        var totalPriority = 0;
        var i = 0;
        for (i = 0; i < solution.length; i++) {
            possibleWeight += items[i].weight;
            if (solution[i] == 1) {
                totalWeight += items[i].weight;
                totalPriority += items[i].priority;

                backpackItems.push(items[i].name);
            } else {
                leftItems.push(items[i].name);
            }
        }

        return {
            totalWeight: totalWeight,
            totalPriority: totalPriority,
            backpack: backpackItems,
            english: 'weight: '
                + totalWeight + '/' + possibleWeight
                + '<br/> Backpack: ' + backpackItems.join(',')
                + '<br/> Left Items: ' + leftItems.join(',')
        };
    }

    function run() {
        gen.initialize({
            fitness: findFitness,
            interpret: interpret,
            solutionSize: items.length, // if we add items to the list we want to automatically adjust the solution size to match.
            maxGenerations: 1000
        });
    }

    return {
        run: run
    }
}(Genetics, Utilities));

// Generator Example
var Generator = (function (gen, utils) {
    // Problem: Build a simple function in javascript that is able to perform
    // simple mathematic operations on the passed in parameters.

    // Uses the function to generate a javascript function and calls it using
    // known combinations of numbers with known results.
    function findFitness(solution) {

        eval(interpretSolution(solution));

        var cntCorrect = 0;

        // A * B - C
        if (testFunc(2, 2, 2) == 2) { cntCorrect++; }
        if (testFunc(2, 3, 6) == 0) { cntCorrect++; }
        if (testFunc(5, 7, 10) == 25) { cntCorrect++; }
        if (testFunc(3, 3, 0) == 9) { cntCorrect++; }

        return {
            value: cntCorrect / 4.0,
            perfect: (cntCorrect == 4)
        };
    }

    // Given an array of bits it will generate a simple javascript function.
    function interpretSolution(solution) {
        var keys = [
            'createFunction',
            'callFunction',
            'createVariable',
            'returnVariable'
        ],
            names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
            structure = {
                keys: ['createVariable'],
                //keys: ['createFunction', 'createVariable'],
                variables: [],
                functions: [],
                currentName: 0
            },
            currStructure = structure,
            testString = 'function testFunc(',
            reader = utils.readArray(solution);

        var paramCount = 3;
        var i = 0;

        for (i = 0; i < paramCount; i++) {
            if (i != 0) { testString += ','; }
            testString += names[i];
            currStructure.variables.push(names[i]);
        }
        currStructure.currentName = paramCount;
        testString += '){';

        currStructure.keys.push('addVariables');
        currStructure.keys.push('subtractVariables');
        currStructure.keys.push('multiplyVariables');
        currStructure.keys.push('divideVariables');

        while (!reader.endOfArray()) {
            var action = currStructure.keys[utils.toDecimal(reader.next(utils.getBitLength(currStructure.keys.length)))];

            if (action == 'createFunction') {
                testString += 'function ' + names[currStructure.currentName] + '() {';

                currStructure.functions.push({
                    keys: ['createFunction', 'createVariable', 'returnVariable'],
                    name: names[currStructure.currentName],
                    variables: [],
                    functions: [],
                    currentName: 0,
                    parentFunction: currStructure
                });

                currStructure.currentName++;

                currStructure = currStructure.functions[currStructure.functions.length - 1];

            } else if (action == 'createVariable') {

                testString += 'var ' + names[currStructure.currentName] + ' = ' + utils.toDecimal(reader.next(3)) + ';';

                currStructure.variables.push(names[currStructure.currentName]);

                currStructure.currentName++;
            } else if (action == 'returnVariable') {
                var varName = currStructure.variables[utils.toDecimal(reader.next(utils.getBitLength(currStructure.variables.length)))];
                testString += 'return ' + (varName ? varName : 'void') + ';}';

                currStructure = currStructure.parentFunction;
            } else if (action == 'callFunction') {
                var funcName = currStructure.functions[utils.toDecimal(reader.next(utils.getBitLength(currStructure.functions.length)))];
                testString += (funcName ? funcName + '();' : '');
            } else if (action == 'addVariables') {
                testString += 'var '
                    + names[currStructure.currentName]
                    + ' = '
                    + currStructure.variables[utils.toDecimal(reader.next(utils.getBitLength(currStructure.variables.length)))]
                    + ' + '
                    + currStructure.variables[utils.toDecimal(reader.next(utils.getBitLength(currStructure.variables.length)))]
                    + ';';

                currStructure.variables.push(names[currStructure.currentName]);

                currStructure.currentName++;
            } else if (action == 'subtractVariables') {
                testString += 'var '
                    + names[currStructure.currentName]
                    + ' = '
                    + currStructure.variables[utils.toDecimal(reader.next(utils.getBitLength(currStructure.variables.length)))]
                    + ' - '
                    + currStructure.variables[utils.toDecimal(reader.next(utils.getBitLength(currStructure.variables.length)))]
                    + ';';

                currStructure.variables.push(names[currStructure.currentName]);

                currStructure.currentName++;
            } else if (action == 'multiplyVariables') {
                testString += 'var '
                    + names[currStructure.currentName]
                    + ' = '
                    + currStructure.variables[utils.toDecimal(reader.next(utils.getBitLength(currStructure.variables.length)))]
                    + ' * '
                    + currStructure.variables[utils.toDecimal(reader.next(utils.getBitLength(currStructure.variables.length)))]
                    + ';';

                currStructure.variables.push(names[currStructure.currentName]);

                currStructure.currentName++;

            } else if (action == 'divideVariables') {
                testString += 'var '
                    + names[currStructure.currentName]
                    + ' = '
                    + currStructure.variables[utils.toDecimal(reader.next(utils.getBitLength(currStructure.variables.length)))]
                    + ' / '
                    + currStructure.variables[utils.toDecimal(reader.next(utils.getBitLength(currStructure.variables.length)))]
                    + ';';

                currStructure.variables.push(names[currStructure.currentName]);

                currStructure.currentName++;

            }
        }

        while (currStructure.parentFunction) {
            testString += 'return void;}'
            currStructure = currStructure.parentFunction;
        }

        testString += 'return ' + currStructure.variables[currStructure.variables.length - 1] + ';}';

        return testString;
    }

    var config = {
        fitness: findFitness,
        interpret: interpretSolution,
        solutionSize: 25, // 40
        maxGenerations: 1000,
        mutationRate: 3
    };

    function run() {
        gen.initialize(config);
    }

    return {
        run: run,
        config: config
    };
}(Genetics, Utilities));

Utilities.resetDisplay();
