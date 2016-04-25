var gen = require('./genetics.js');

var paramCount = 3;

function findFitness(solution) {

    eval(interpretSolution(solution));

    var cntCorrect = 0;

    if (testFunc(2, 2, 2) == 8) { cntCorrect++; }
    if (testFunc(3, 2, 1) == 6) { cntCorrect++; }
    if (testFunc(5, 7, 2) == 70) { cntCorrect++; }
    if (testFunc(4, 3, 5) == 60) { cntCorrect++; }

    return cntCorrect / 4.0;
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
        variables: [],
        functions: [],
        currentName: 0
    },
    currStructure = structure,
    testString = 'function testFunc(',
    reader = gen.readArray(solution),
    i = 0;

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
    report: function (stats) {
        console.log(stats);
    },
    maxSolutionSize: 30,
    maxGenerations: 1000,
    solutionGrowth: 4
});

console.log(gen.stats());