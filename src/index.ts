const ifExpression = (condition: boolean): IfStatement => {
    return makeIfStatement(condition);
}

const makeIfStatement = (cond: boolean): IfStatement => {
    return {
        then: <T>(thenValue: T) => makeThenStatement(cond, thenValue)
    }
}

const makeThenStatement = <T>(cond: boolean, thenValue: T): ThenStatement<T> => {
    return {
        else: <V>(elseValue: V) => {
            if (cond) {
                return thenValue;
            } else {
                return elseValue;
            }
        },
        elseIf: (cond2: boolean) => {
            if (cond) {
                return makeLoadedIfStatement(thenValue) as any;
            } else {
                return makeIfStatement(cond2);
            }
        }
    }
}

const makeLoadedIfStatement = <T>(fixedValue: T) => {
    return {
        then: <TX>(ignoredThenValue: TX) => makeLoadedThenStatement(fixedValue)
    }
}

const makeLoadedThenStatement = <T>(fixedValue: T) => {
    return {
        else: <VX>(ignoredElseValue: VX) => {
            return fixedValue;
        },
        elseIf: (ignoredCond: boolean) => {
            return makeLoadedIfStatement(fixedValue);
        }
    }
}

type IfStatement = {
    then: <T>(t: T) => ThenStatement<T>;
}

type  ElseIfStatement<T1> = {
    then: <T2>(t2: T2) => ThenStatement<T1 | T2>;
}

type ThenStatement<T> = {
    else: ElseStatement<T>;
    elseIf: (condition: boolean) => ElseIfStatement<T>;
}

type ElseStatement<T> = <V>(v: V) => T | V;

export default ifExpression;
export const $if = ifExpression;
