const ifExpression = (condition) => {
    return {
        then: thenExpression(condition)
    }
};

const fakeIfExpression = riggedValue => _ignoredCondition => {
    return {
        then: fakeThenExpression(riggedValue)
    }
};

const fakeThenExpression = riggedValue => _ignoredThenValue => {
    return {
        else: fakeElseExpression(riggedValue),
        elseIf: fakeIfExpression(riggedValue)
    }
};

const fakeElseExpression = riggedValue => _ignoredElseValue => {
    return riggedValue;
};

const thenExpression = condition => positiveValue => {
    return {
        else: elseExpression(condition, positiveValue),
        elseIf: !condition ? ifExpression : fakeIfExpression(positiveValue)
    };
};

const elseExpression = (aggregateCondition, aggregatePositiveValue) => negativeValue => {
    if (!aggregateCondition) {
        return negativeValue;
    } else {
        return aggregatePositiveValue;
    }
};

module.exports = {
    $if: ifExpression,
    default: ifExpression
};
