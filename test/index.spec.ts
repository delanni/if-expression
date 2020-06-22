import {$if} from "../src";


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
