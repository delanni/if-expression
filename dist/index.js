"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$if = void 0;
var ifExpression = function (condition) {
    return makeIfStatement(condition);
};
var makeIfStatement = function (cond) {
    return {
        then: function (thenValue) { return makeThenStatement(cond, thenValue); },
        thenDo: function (thenArrow) { return makeThenDoStatement(cond, thenArrow); },
    };
};
var makeThenStatement = function (cond, thenValue) {
    return {
        else: function (elseValue) {
            if (cond) {
                return thenValue;
            }
            else {
                return elseValue;
            }
        },
        elseIf: function (cond2) {
            if (cond) {
                return makeLoadedIfStatement(thenValue);
            }
            else {
                return makeIfStatement(cond2);
            }
        },
        elseDo: function (elseArrow) {
            if (cond) {
                return thenValue;
            }
            else {
                return elseArrow();
            }
        }
    };
};
var makeThenDoStatement = function (cond, thenArrow) {
    return {
        else: function (elseValue) {
            if (cond) {
                return thenArrow();
            }
            else {
                return elseValue;
            }
        },
        elseIf: function (cond2) {
            if (cond) {
                return makeLoadedIfStatement(thenArrow());
            }
            else {
                return makeIfStatement(cond2);
            }
        },
        elseDo: function (elseArrow) {
            if (cond) {
                return thenArrow();
            }
            else {
                return elseArrow();
            }
        }
    };
};
var makeLoadedIfStatement = function (fixedValue) {
    return {
        then: function (ignoredThenValue) { return makeLoadedThenStatement(fixedValue); },
        thenDo: function (ignoredThenValue) { return makeLoadedThenStatement(fixedValue); }
    };
};
var makeLoadedThenStatement = function (fixedValue) {
    return {
        else: function (ignoredElseValue) {
            return fixedValue;
        },
        elseIf: function (ignoredCond) {
            return makeLoadedIfStatement(fixedValue);
        },
        elseDo: function (ignoredElseArrow) {
            return fixedValue;
        }
    };
};
exports.default = ifExpression;
exports.$if = ifExpression;
//# sourceMappingURL=index.js.map