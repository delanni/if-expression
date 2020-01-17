var ifExpression = function (condition) {
    return {
        then: thenExpression(condition)
    }
};

var fakeIfExpression = function (riggedValue) {
    return function (_ignoredCondition) {
        return {
            then: fakeThenExpression(riggedValue)
        }
    };
};

var fakeThenExpression = function (riggedValue) {
    return function (_ignoredThenValue) {
        return {
            else: fakeElseExpression(riggedValue),
            elseIf: fakeIfExpression(riggedValue)
        }
    };
};

var fakeElseExpression = function (riggedValue) {
    return function (_ignoredElseValue) {
        return riggedValue;
    };
};

var thenExpression = function (condition) {
    return function (positiveValue) {
        return {
            else: elseExpression(condition, positiveValue),
            elseIf: !condition ? ifExpression : fakeIfExpression(positiveValue)
        };
    };
};

var elseExpression = function (aggregateCondition, aggregatePositiveValue) {
    return function (negativeValue) {
        if (!aggregateCondition) {
            return negativeValue;
        } else {
            return aggregatePositiveValue;
        }
    };
};

module.exports = {
    $if: ifExpression,
    default: ifExpression
};
