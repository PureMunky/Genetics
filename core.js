var generational = (function () {
    var currentIndividuals = [],
    currentSolution1 = [],
    currentFitness1 = 0,
    currentSolution2 = [],
    currentFitness2 = 0,
    currentGeneration = 0,
    foundinXGenerations = 0,
    solutionSize = 40,
    populationSizeMax = 1000,
    mutationRate = 1,
    maxGenerations = 1000,
    foundSolution = false,
    findFitness,
    interpretSolution;

    function generatePopulation() {
        var i = 0;

        currentIndividuals = [];

        for (i = 0; i < populationSizeMax; i++) {
            currentIndividuals[i] = mate(currentSolution1, currentSolution2);
        }
    }

    function mate(in1, in2) {
        var i = 0;
        var offspring = [];
        var bitValue = 0;

        for (i = 0; i < solutionSize; i++) {
            bitValue = 0;

            if (i < (solutionSize / 2)) {
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

    function findNewParents() {
        var i = 0,
            currFit1 = 0,
            currInd1 = [],
            currFit2 = 0,
            currInd2 = [],
            testFit = 0;

        for (i = 0; i < currentIndividuals.length; i++) {
            testFit = findFitness(currentIndividuals[i]);

            if (testFit > currFit1) {
                currFit1 = testFit;
                currInd1 = currentIndividuals[i];
            }

            if ((testFit > currFit2 && testFit < currFit1) || (currInd2.length == 0 && i > 0)) {
                currFit2 = testFit
                currInd2 = currentIndividuals[i];
            }

            if (testFit > currentFitness1) {
                foundinXGenerations = currentGeneration;
            }
        }

        currentSolution1 = currInd1;
        currentFitness1 = currFit1;
        currentSolution2 = currInd2;
        currentFitness2 = currFit2;
    }

    function getBitLength(keyCount) {
        var i = 0;

        while (Math.pow(2, i) < keyCount) {
            i++;
        }

        return i;
    }

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

    function createInitialParents() {
        var i = 0;

        currentSolution1 = createRandomSolution();
        currentSolution2 = createRandomSolution();
    }

    function generateInitialPopulation() {
        var i = 0;

        currentIndividuals = [];

        for (i = 0; i < populationSizeMax; i++) {
            currentIndividuals[i] = createRandomSolution();
        }
    }

    function createRandomSolution() {
        var i = 0,
            solution = [];

        for (i = 0; i < solutionSize; i++) {
            solution[i] = (Math.floor((Math.random() * 100) % 2));
        }

        return solution;
    }

    function run() {
        document.write('<pre>');
        var i = 0,
            start = new Date(),
            end = new Date();

        generateInitialPopulation();
        findNewParents();
        //createInitialParents();
        for (i = 0; i < maxGenerations; i++) {
            if (!foundSolution) {
                currentGeneration++;
                generatePopulation();
                findNewParents();
            }
        }

        end = new Date();
        document.write('best solution');
        document.write('<br/>');
        document.write(interpretSolution(currentSolution1));
        document.write('<br/>');
        document.write('Fitness: ' + currentFitness1);
        document.write('<br/>');
        document.write('Found in ' + foundinXGenerations + ' Generations');
        document.write('<br/>');
        document.write((end - start) + ' milliseconds');
        document.write('</pre>');

        return currentSolution1;
    }

    function init(config) {
        findFitness = config.fitness;
        interpretSolution = config.interpret;
        solutionSize = config.solutionSize || 40;
        populationSizeMax = config.populationMax || 100;
        mutationRate = config.mutationRate || 1;
        maxGenerations = config.maxGenerations || 100;

        return run();
    }

    return {
        initialize: init,
        readArray: readArray,
        toDecimal: toDecimal,
        getBitLength: getBitLength
    }
}());

// Javascript Generator
(function (gen) {
    function findFitness(solution) {

        eval(interpretSolution(solution));

        var cntCorrect = 0;

        if (testFunc(2, 2) == 4) { cntCorrect++; }
        if (testFunc(2, 3) == 6) { cntCorrect++; }
        if (testFunc(5, 7) == 35) { cntCorrect++; }
        if (testFunc(3, 3) == 9) { cntCorrect++; }

        return cntCorrect/4.0;
    }

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
        reader = gen.readArray(solution);

        var paramCount = 2;
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
            var action = currStructure.keys[gen.toDecimal(reader.next(gen.getBitLength(currStructure.keys.length)))];

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

                testString += 'var ' + names[currStructure.currentName] + ' = ' + gen.toDecimal(reader.next(3)) + ';';

                currStructure.variables.push(names[currStructure.currentName]);

                currStructure.currentName++;
            } else if (action == 'returnVariable') {
                var varName = currStructure.variables[gen.toDecimal(reader.next(gen.getBitLength(currStructure.variables.length)))];
                testString += 'return ' + (varName ? varName : 'void') + ';}';

                currStructure = currStructure.parentFunction;
            } else if (action == 'callFunction') {
                var funcName = currStructure.functions[gen.toDecimal(reader.next(gen.getBitLength(currStructure.functions.length)))];
                testString += (funcName ? funcName + '();' : '');
            } else if (action == 'addVariables') {
                testString += 'var '
                    + names[currStructure.currentName]
                    + ' = '
                    + currStructure.variables[gen.toDecimal(reader.next(gen.getBitLength(currStructure.variables.length)))]
                    + ' + '
                    + currStructure.variables[gen.toDecimal(reader.next(gen.getBitLength(currStructure.variables.length)))]
                    + ';';

                currStructure.variables.push(names[currStructure.currentName]);

                currStructure.currentName++;
            } else if (action == 'subtractVariables') {
                testString += 'var '
                    + names[currStructure.currentName]
                    + ' = '
                    + currStructure.variables[gen.toDecimal(reader.next(gen.getBitLength(currStructure.variables.length)))]
                    + ' - '
                    + currStructure.variables[gen.toDecimal(reader.next(gen.getBitLength(currStructure.variables.length)))]
                    + ';';

                currStructure.variables.push(names[currStructure.currentName]);

                currStructure.currentName++;
            } else if (action == 'multiplyVariables') {
                testString += 'var '
                    + names[currStructure.currentName]
                    + ' = '
                    + currStructure.variables[gen.toDecimal(reader.next(gen.getBitLength(currStructure.variables.length)))]
                    + ' * '
                    + currStructure.variables[gen.toDecimal(reader.next(gen.getBitLength(currStructure.variables.length)))]
                    + ';';

                currStructure.variables.push(names[currStructure.currentName]);

                currStructure.currentName++;

            } else if (action == 'divideVariables') {
                testString += 'var '
                    + names[currStructure.currentName]
                    + ' = '
                    + currStructure.variables[gen.toDecimal(reader.next(gen.getBitLength(currStructure.variables.length)))]
                    + ' / '
                    + currStructure.variables[gen.toDecimal(reader.next(gen.getBitLength(currStructure.variables.length)))]
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

    gen.initialize({
        fitness: findFitness,
        interpret: interpretSolution,
        solutionSize: 20,
        maxGenerations: 1000
    });
}(generational));

// Binary Testing
(function (gen) {

    function findFitness(solution) {
        var fitness = 0,
            i = 0;

        for (var i = 0; i < solution.length; i++) {
            fitness += solution[i];
        }

        return 1 / Math.abs(fitness - 7);
    }

    function interpret(solution) {
        return solution;
    }

    //var bestSolution = gen.initialize({
    //    fitness: findFitness,
    //    interpret: interpret,
    //    solutionSize: 20,
    //    maxGenerations: 1000
    //});

}(generational));