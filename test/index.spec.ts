import {$if} from "../src";

type Unit<T> = () => T;

describe("$if expression", () => {
    it("returns the .then clause's value when condition is true", () => {
        const expressionValue = $if(5 > 2).then('potato').else('tomato');

        expect(expressionValue).toBe('potato');
    });

    it("returns the .else clause's value when condition is false", () => {
        const expressionValue = $if(5 > 10).then('potato').else('banana');

        expect(expressionValue).toBe('banana');
        expect(expressionValue).not.toBe('potato');
    });

    it("doesn't return the value if there's no else chain", () => {
        const expressionValue = $if(5 > 10).then('potato');

        expect(expressionValue).not.toBe('banana');
        expect(expressionValue).not.toBe('potato');
    });
});

describe("$if with elseif clause", () => {
    it("returns the first .then clause's value when condition is true", () => {
        const expressionValue = $if(5 > 4).then('potato').elseIf(5 > 2).then('tomato').else('banana');

        expect(expressionValue).toBe('potato');
    });

    it("returns the elseif's then clase's value when first expression is false, second is true", () => {
        const expressionValue = $if(5 > 10).then('potato').elseIf(5 > 2).then('tomato').else('banana');

        expect(expressionValue).toBe('tomato');
    });

    it("returns the else clause's value when all conditions are false", () => {
        const expressionValue = $if(5 > 10).then('potato').elseIf(5 > 100).then('tomato').else('banana');

        expect(expressionValue).toBe('banana');
    });

    it("works with a random amount of elseIf chains", () => {
        const originalReturnValue = "dingos";
        const anyOtherReturnValue = "dongos";

        let randomInt = Math.floor(Math.random() * 100) + 1;

        let expressionValue: any = $if(true).then(originalReturnValue);

        while (randomInt > 0) {
            randomInt -= 1;
            expressionValue = expressionValue.elseIf(false).then(anyOtherReturnValue);
        }

        expressionValue = expressionValue.else(anyOtherReturnValue);

        expect(expressionValue).toBe(originalReturnValue);
    });

    it("keeps the value of the first true condition's value", () => {
        const getRandomBit = () => Math.random() > 0.5 ? 1 : 0;
        let randomInt = Math.floor(Math.random() * 100) + 1;

        const bitArray = [];
        while (randomInt-- > 0) {
            bitArray.push(getRandomBit());
        }

        const firstTrueIndex = bitArray.indexOf(1);

        let expressionValue: any = $if(false).then('boo');

        for (let i = 0; i < bitArray.length; i++) {
            expressionValue = expressionValue.elseIf(bitArray[i] === 1).then(i);
        }

        expressionValue = expressionValue.else('boo');

        expect(expressionValue).toBe(firstTrueIndex);
    });
});

describe("$if with delayed values", () => {
    type A = 'valA';
    type B = 'valB';
    type C = 'valC';

    let fnA: () => 'valA';
    let fnB: () => 'valB';
    let fnC: () => 'valC';

    beforeEach(() => {
        fnA = jest.fn(() => 'valA');
        fnB = jest.fn(() => 'valB');
        fnC = jest.fn(() => 'valC');
    });

    it('works on .thenDo()', () => {
        const value: A | B = $if(true).thenDo(fnA).elseDo(fnB);

        expect(value).toBe('valA');
        expect(fnA).toBeCalledTimes(1);
        expect(fnB).not.toBeCalled();
    });


    it('works on .elseDo()', () => {
        const value: A | B = $if(false).thenDo(fnA).elseDo(fnB);

        expect(value).toBe('valB');
        expect(fnA).not.toBeCalled();
        expect(fnB).toBeCalledTimes(1);
    });

    it('works on .elseIf.thenDo()', () => {
        const value: A | B | C = $if(false).thenDo(fnA).elseIf(true).thenDo(fnB).elseDo(fnC);

        expect(value).toBe('valB');
        expect(fnA).not.toBeCalled();
        expect(fnB).toBeCalledTimes(1);
        expect(fnC).not.toBeCalled();
    });

    it('works on .elseIf.elseDo()', () => {
        const value: A | B | C = $if(false).thenDo(fnA).elseIf(false).thenDo(fnB).elseDo(fnC);

        expect(value).toBe('valC');
        expect(fnA).not.toBeCalled();
        expect(fnB).not.toBeCalled();
        expect(fnC).toBeCalledTimes(1);
    });

    it(`doesn't bleed over to any further arrows`, () => {
        const fnD: Unit<'valD'> = jest.fn(() => 'valD');
        const fnE: Unit<'valE'> = jest.fn(() => 'valE');

        const value: A|B|C|'valD'|'valE' = $if(false).thenDo(fnA)
            .elseIf(true).thenDo(fnB)
            .elseIf(true).thenDo(fnC)
            .elseIf(false).thenDo(fnD)
            .elseDo(fnE);

        expect(value).toBe('valB');
        expect(fnA).not.toBeCalled();
        expect(fnB).toBeCalledTimes(1);
        expect(fnC).not.toBeCalled();
        expect(fnD).not.toBeCalled();
        expect(fnE).not.toBeCalled();
    });
});

describe("$if with mixed clauses", () => {
    type A = 'valA';
    type B = 'valB';
    type C = 'valC';

    let fnA: () => 'valA';
    let fnB: () => 'valB';
    let fnC: () => 'valC';

    beforeEach(() => {
        fnA = jest.fn(() => 'valA');
        fnB = jest.fn(() => 'valB');
        fnC = jest.fn(() => 'valC');
    });

    it('works on .thenDo()', () => {
        const value: A | B = $if(true).then(fnA()).elseDo(fnB);

        expect(value).toBe('valA');
        expect(fnA).toBeCalledTimes(1);
        expect(fnB).not.toBeCalled();
    });


    it('works on .elseDo()', () => {
        const value: A | B = $if(false).then(fnA()).elseDo(fnB);

        expect(value).toBe('valB');
        expect(fnB).toBeCalledTimes(1);
    });

    it('works on .elseIf.thenDo()', () => {
        const value: A | B | C = $if(false).thenDo(fnA).elseIf(true).thenDo(fnB).else(fnC());

        expect(value).toBe('valB');
        expect(fnA).not.toBeCalled();
        expect(fnB).toBeCalledTimes(1);
    });

    it('works on .elseIf.elseDo()', () => {
        const value: A | B | C = $if(false).thenDo(fnA).elseIf(false).then(fnB()).elseDo(fnC);

        expect(value).toBe('valC');
        expect(fnA).not.toBeCalled();
        expect(fnC).toBeCalledTimes(1);
    });

    it(`doesn't bleed over`, () => {
        const fnD: Unit<'valD'> = jest.fn(() => 'valD');
        const fnE: Unit<'valE'> = jest.fn(() => 'valE');

        const value: A|B|C|'valD'|'valE' = $if(false).then(fnA())
            .elseIf(true).thenDo(fnB)
            .elseIf(true).then(fnC())
            .elseIf(true).thenDo(fnD)
            .else(fnE());

        expect(value).toBe('valB');
        expect(fnB).toBeCalledTimes(1);
        expect(fnD).not.toBeCalled();
    });
});
