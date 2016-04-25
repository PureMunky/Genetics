var currentIndividuals = [],
    currentSolution1 = [],
    currentFitness1 = 0,
    currentSolution2 = [],
    currentFitness2 = 0,
    currentGeneration = 0,
    foundinXGenerations = 0,
    maxSolutionSize = 40,
    currentSolutionSize = 2,
    solutionSizeGrowth = 2,
    populationSizeMax = 1000,
    mutationRate = 1,
    maxGenerations = 1000,
    foundSolution = false,
    findFitness,
    interpretSolution,
    reportFunction,
    reportDuration = 0,
    start = new Date(),
    lastReport = start,
    end = new Date();

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

    for (i = 0; i < currentSolutionSize; i++) {
        bitValue = 0;

        if (i < (currentSolutionSize / 2)) {
            bitValue = in1[i];
        } else {
            bitValue = in2[i];
        }

        if (bitValue == undefined) {
            bitValue = 0;
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
        if (!foundSolution) {
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

            if (testFit === 1) {
                foundSolution = true;
            }
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

    for (i = 0; i < currentSolutionSize; i++) {
        solution[i] = (Math.floor((Math.random() * 100) % 2));
    }

    return solution;
}

function run() {
    var i = 0,
        start = new Date(),
        end = new Date(),
        lastReport = start;

    generateInitialPopulation();
    findNewParents();
    //createInitialParents();
    for (i = 0; i < maxGenerations && currentSolutionSize <= maxSolutionSize; i++) {
        var currentTime = new Date();

        if ((currentTime - lastReport) > reportDuration && reportFunction) {
            end = new Date();
            lastReport = end;

            reportFunction(getStats());
        }

        if (!foundSolution) {
            currentGeneration++;
            generatePopulation();
            findNewParents();

            if (i >= maxGenerations - 1) {
                currentSolutionSize += solutionSizeGrowth;
                i = 0;

                generateInitialPopulation();
                findNewParents();
            }
        }
    }

    end = new Date();

    return currentSolution1;
}

function init(config) {
    findFitness = config.fitness;
    interpretSolution = config.interpret;
    maxSolutionSize = config.maxSolutionSize || 40;
    currentSolutionSize = config.minSolutionSize || 2;
    solutionSizeGrowth = config.solutionGrowth || 2;
    populationSizeMax = config.populationMax || 100;
    mutationRate = config.mutationRate || 1;
    maxGenerations = config.maxGenerations || 100;
    reportDuration = config.reportDuration || 1000;
    reportFunction = config.report;

    return run();
}

function getStats() {
    return {
        best: interpretSolution(currentSolution1),
        bestArr: currentSolution1,
        fitness: currentFitness1,
        generations: foundinXGenerations,
        time: (end - start),
        found: foundSolution,
        size: currentSolutionSize
    };
}

module.exports.initialize = init;
module.exports.readArray = readArray;
module.exports.toDecimal = toDecimal;
module.exports.getBitLength = getBitLength;
module.exports.stats = getStats;