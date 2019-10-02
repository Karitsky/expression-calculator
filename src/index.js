function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {

    // удаляем пробелы массива
    let tempArray = expr.split(' ');
    for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i] == '') {
            tempArray.splice(i, 1);
        }
    }
    let exprWithNoSpaces = tempArray.join('');
    let correctExpr = exprWithNoSpaces.split('');

    // проверяем парность скобок
    let openingB = 0;
    let closingB = 0;
    for (let l = 0; l < correctExpr.length; l++) {
        if (correctExpr[l] == '(') {
            openingB++;
        } else if (correctExpr[l] == ')') {
            closingB++;
        }
    }
    if (openingB != closingB) {
        throw new Error('ExpressionError: Brackets must be paired');
    }


    // задаем правила
    let symbols = {
        '(' : 0,
        ')' : 0,
        '+' : 1,
        '-' : 1,
        '*' : 2,
        '/' : 2,
    }
    let calculating = function(a, b, lastOperator) {
        if (lastOperator == '*') {
            return a * b;
        } else if (lastOperator == '/') {
            if (a == 0 || b == 0) {
                throw new Error('TypeError: Division by zero.')
            } else {
                return (a / b);
            }
        } else if (lastOperator == '+') {
            return a + b;
        } else if (lastOperator == '-') {
            return a - b;
        }
    }


    // раскладываем символы выражения по стекам
    let allNumbers = [];
    let b = 0;
    let a = 0;
    let allOperators = [];
    let currentOperator = '';
    let lastOperator = '';
    let actionResult = 0;

    for (let i = 0; i < correctExpr.length; i++) {

        // складываем числа в стек
        if (correctExpr[i] > -1) {
            let multiDigit = correctExpr[i]; 
            while (correctExpr[i + 1] > -1) {
                multiDigit += correctExpr[i + 1];
                i++;
                }
            allNumbers.push(multiDigit);

        // складываем операторы в стек
        } else if (correctExpr[i] in symbols) {
            currentOperator = correctExpr[i];
            let currentPriority = symbols[currentOperator];
            let lastInStackPriority = symbols[allOperators[allOperators.length - 1]];

            if (allOperators.length == 0 || currentPriority > lastInStackPriority) {
                allOperators.push(currentOperator);

            } else if (currentOperator == '(') {
                allOperators.push(currentOperator);

        // считаем
            } else if (currentPriority <= lastInStackPriority) {

                while (currentPriority <= lastInStackPriority) {

                    if (currentOperator == ')' && allOperators[allOperators.length - 1] == '(') {
                        currentOperator = '';
                        allOperators.pop();
                        break;
                    } else {
                        actionResult = 0;
                        lastOperator = allOperators[allOperators.length - 1];
                        b = +allNumbers[allNumbers.length - 1];
                        a = +allNumbers[allNumbers.length - 2];
                        actionResult = +calculating(a, b, lastOperator);
                        allNumbers.pop();
                        allNumbers.pop();
                        allOperators.pop();
                        allNumbers.push(actionResult);
                        lastInStackPriority = symbols[allOperators[allOperators.length - 1]];
                    }
                }
                if (currentOperator !== '') {
                    allOperators.push(currentOperator);
                }
            }  
        } 
    }          

    if (allOperators.length != 0) {

        for (let k = 0; k < allOperators.length;) {
            lastOperator = allOperators[allOperators.length - 1];
            b = +allNumbers[allNumbers.length - 1];
            a = +allNumbers[allNumbers.length - 2];
            actionResult = +calculating(a, b, lastOperator);
            allNumbers.pop();
            allNumbers.pop();
            allOperators.pop();
            allNumbers.push(actionResult);
        }
    }
    return actionResult;
}

module.exports = {
    expressionCalculator
}