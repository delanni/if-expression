# $if 💰Expression based conditional.
_You can read this as dolla'-if._

Javascript's `if` is unfortunately not an expression, which means you can't use it as a right hand side of an expression or in places where you can only put a single value. Luckily, `$if` can function as an expression.

## Installation

For now, you can only use this with node.js, or using a bundler, because it's not exposing any globals, but who are we kidding, it's 2020, you probably do this daily already.

```bash
npm install --save dolla-if
```

## Examples

This if-expression works like a regular if-else clause, except, your expression has a return value:
```javascript
const { $if } = require('dolla-if');
// or to you who live in the future: 
// import $if from 'dolla-if';

const isPartyTime = new Date().getHours() > 20 || new Date().getHours() < 5;
const myFriendsCallMe = $if(isPartyTime)
                            .then('ßling-ßling John$on')
                            .else('Gregory Buttsoup');
console.log({myFriendsCallMe});
```

It's especially useful when you're trying to use some inline react JSX, because those inline curlies only support expressions, so unless you want to do some IIFE ugliness:
```jsx
const RegularHeader = ({ dayOfTheWeek }) => {
    return (
        <div>
            {
                $if(dayOfTheWeek === 3).then(<h1 style={partyTheme}>It's Wednesday my dudes! 🐸</h1>)
                .elseIf(dayOfTheWeek === 5).then(<h1 style={partyTheme}>Call Rebecca Black! 👯‍♂️</h1>)
                .else(<h1 style={{backgroundColor: 'gray'}}>No partying allowed. 🙅‍♂️</h1>)
            }
        </div>
    )
}
```

You can also use it with unit functions, to short circuit execution of branches where the chain executes to false:
```javascript
const result = $if(false)
    .thenDo(() => computeEngine.computeValue())
    .elseIf(true).thenDo(() => computeEngine.computeSomethingElse())
    .elseIf(Math.random > 0.5).then('bingo!')
    .elseDo(computeEngine.getDefaultValue);
```
In this above example, only one of the branches gets executed, so you don't need to worry about all the wasted calculation or unwanted side-effects.

---

And $if also supports types through [Typescript](http://typescriptlang.org/)! 
