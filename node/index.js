var gen = require('./genetics.js');

var targetBitCount = 5;

function findFitness(solution) {
    var bitCount = 0,
        i = 0;

    for (var i = 0; i < solution.length; i++) {
        bitCount += solution[i];
    }

    return 1 - Math.abs(bitCount - targetBitCount);
}

function interpret(solution) {
    return solution;
}

gen.initialize({
    fitness: findFitness,
    interpret: interpret,
    solutionSize: 30,
    maxGenerations: 1000
});

console.log(gen.stats());