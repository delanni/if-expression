const ifExpression = (condition: boolean): IfStatement => {
    return makeIfStatement(condition);
}

const makeIfStatement = (cond: boolean): IfStatement => {
    return {
        then: <T>(thenValue: T) => makeThenStatement(cond, thenValue),
        thenDo: <T>(thenArrow: Unit<T>) => makeThenDoStatement(cond, thenArrow),
    };
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
                return makeLoadedIfStatement(thenValue);
            } else {
                return makeIfStatement(cond2);
            }
        },
        elseDo: <V>(elseArrow: Unit<V>) => {
            if (cond) {
                return thenValue;
            } else {
                return elseArrow();
            }
        }
    };
}

const makeThenDoStatement = <T>(cond: boolean, thenArrow: Unit<T>): ThenStatement<T> => {
    return {
        else: <V>(elseValue: V) => {
            if (cond) {
                return thenArrow();
            } else {
                return elseValue;
            }
        },
        elseIf: (cond2: boolean) => {
            if (cond) {
                return makeLoadedIfStatement(thenArrow()) as any;
            } else {
                return makeIfStatement(cond2);
            }
        },
        elseDo: <V>(elseArrow: Unit<V>) => {
            if (cond) {
                return thenArrow();
            } else {
                return elseArrow();
            }
        }
    };
}

const makeLoadedIfStatement = <T>(fixedValue: T): IfStatement => {
    return {
        then: <TX>(ignoredThenValue: TX) => makeLoadedThenStatement(fixedValue),
        thenDo: <TX>(ignoredThenValue: Unit<TX>) => makeLoadedThenStatement(fixedValue)
    }
}

const makeLoadedThenStatement = <T>(fixedValue: T): ThenStatement<T> => {
    return {
        else: <VX>(ignoredElseValue: VX) => {
            return fixedValue;
        },
        elseIf: (ignoredCond: boolean) => {
            return makeLoadedIfStatement(fixedValue);
        },
        elseDo: <VX>(ignoredElseArrow: Unit<VX>) => {
            return fixedValue;
        }
    }
}

type Unit<T> = () => T;

type IfStatement = {
    then: <T>(t: T) => ThenStatement<T>;
    thenDo: <T>(p: Unit<T>) => ThenStatement<T>;
}

type  ElseIfStatement<T1> = {
    then: <T2>(t2: T2) => ThenStatement<T1 | T2>;
    thenDo: <T2>(p: Unit<T2>) => ThenStatement<T1 | T2>;
}

type ThenStatement<T> = {
    else: ElseStatement<T>;
    elseDo: <V>(p: Unit<V>) => T | V;
    elseIf: (condition: boolean) => ElseIfStatement<T>;
}

type ElseStatement<T> = <V>(v: V) => T | V;

export default ifExpression;
export const $if = ifExpression;
