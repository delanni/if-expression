"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ifExpression = function (condition) {
    return makeIfStatement(condition);
};
var makeIfStatement = function (cond) {
    return {
        then: function (thenValue) { return makeThenStatement(cond, thenValue); }
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
        }
    };
};
var makeLoadedIfStatement = function (fixedValue) {
    return {
        then: function (ignoredThenValue) { return makeLoadedThenStatement(fixedValue); }
    };
};
var makeLoadedThenStatement = function (fixedValue) {
    return {
        else: function (ignoredElseValue) {
            return fixedValue;
        },
        elseIf: function (ignoredCond) {
            return makeLoadedIfStatement(fixedValue);
        }
    };
};
exports.default = ifExpression;
exports.$if = ifExpression;
//# sourceMappingURL=index.js.map