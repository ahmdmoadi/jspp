# Meow - jspp
**THIS IS JUST A CONCEPT**<br>
**ALL RIGHTS RESERVED**<br>
**NO IDEA STEALING**<br>
**hi @ThePrimeagen!**

---

DISCLAIMER: 
I'm a js guy, and no C dev, so the multithreading, malloc, and pointer aspects are things I'm not that familiar with, though I'm fascinated by them!
---

### JavaScript PlusPlus - js++
every single statement must include a semicolon to piss off WebDevSimplified
```js
// every line must include a semicolon
// webDevSimplified must suffer
let a = 0;
```
## Variable Definition
This language is flexible. pick your favorable way to define!
```js
var a = 1;
const b = 0;
// coming from c? enjoy!
int one = 1;
// also make them constants!
const int b = 7;
```
## yay! types!
typed variables can also be like java ones! or <sub>ts ones</sub><br>
and casting a string to number interprets
your string as base11-62!
```java
Integer integer = new Integer(69);
```
```ts
let integer : Integer = 69;
let integer : int = 69;
Integer integer : Integer = 67; // yes this is allowed
```
### valid data types
String:
```java
String
string
char[]
```
Boolean:
```java
bool
boolean
Boolean
```
Float:
```java
float
Float
Long
```
Boolean:
`Boolean`, `boolean`, `bool` are valid
### there are more types but i got lazy
### Pointers?!
Pointers are now more readable:
```c
int a = 55;
int pointer p = addressat a;
// equiv to:
int* p = &brainf;
// ^also allowed

// accessing pointers
console.log(a === *p); // true
```
### Who tf cares about security? bruh
total control is more important.
<br>
malloc? pfft. we edit memory without permission
```c
// at hardCodedMemoryAddress = desiredValue;
at 10234 = malicious_data;
at ptr = malicious_data;
```

## Type Casting
casting a string of letters turns these into a number of their respectable base! (bases range from 11-62)
```java
Integer intOrStringHmm = (Integer)"hello";
```
## Object method/attribute calling/retreival
you can use multiple ways to call methods or fetch attributes!
```js
let object = {
    name: "I want to die",
    age: Infinity
};
console.log(object::age);
console.log(object[age]);
console.log(object.age);
console.log(object->age);
```

## Flexible scope `return`s?!
hmm, what if
```js
function parent() {
    // if scope level is less than 1, evals value as it was outside of the function!
    return<-1>; // equivilant to return<0>, does'nt exit out of function
    this.scope.level;// => 1
    this.scope.name="papa";// by default, it's the function name! so => parent, but it can be changed as well!
    function child0() {
        // regular return
        return "returning as child0";
        // also regular return
        return<2> "nothing suspicious";
        // two returns won't work, just like in js.
    }
    function child1() {
        this.scopeLevel; // => 2
        return<-1> "";//=> results in exiting parent function and returning the string as parent.
    }
    function child2() {
        return<papa> "You're adopted."; //=> also results in exiting parent function and returning the string as parent.
    }
}
```
## Generator functions?
generator what? why? and where is the coil?
```js
function* why() {
    yield "i surrender";
    yield "why are you still here";
}
```
## Classes! horray!
classes MUST start with a capital letter.<br>
starting one with a small letter throws an error.
```js
class Person {
    constructor() {

    }
}
// we can't have that here
class person() {}
//=> NitpickError: capitalize your classes, nitwit.
```
## Error handeling
war crimes are not allowed, or are they?
```js
try {
    throw BallError("dn")
} catch(e : Error) {
    throw BallReturnError("nah, id win.")
}
```
you can also use other keywords
```java
throw Error();
karen Error();
cry Error();
feminist Error();
```
## Garbage Collection
clean up your code, discord mod.
```java
let a = 1;
let b = 2;
let c = a + b;
delete a,b;

let abf = new ArrayBuffer(8);
//or
ArrayBuffer abf : ArrayBuffer = malloc(8) life 2ti; // can be used twice. immedietly discards itself after
let abf = malloc(8) life 2li; // next 2 lines only
within abf char gender = c'm';
delete abf; // delete handles clear() too.
```
## Much wanted ~~problematic~~ features!
`with` comes out of deprecation! but with more rules, of course. with can only be used with objects that are not constants/arrays or anything that conflicts with existing stuff.
```js
with(new Date()) {
    getMinutes();//=> whatever the minutes are
}
with(1) {}//err
with([]) {}//err
with({window:1}) {}//err
with(this) {}//=>works!
```
### idk
```cpp
using namespace new Date();
console.log(getHours());
```
### omg `goto`?!!
goto is back babyyyyyyy
```c
int main() {
    int c = 0;
    start:
        if(c<10) {
            goto increment;
        }
    console.log("%d",c);
    return 0;
    increment:
        c++;
        goto start;
}
```
## 1 core? pfft.
multithreading!
```js
import cpu
if(cpu.thread.count>1) {
    try {
        let threadHandler = cpu.thread.another;
        using (threadHandler) {
            // do stuff
        }
        // or run functions!
        let result = await threadHandler.handle(a=>{
            return Math.random();
        })
    } catch(e : MemoryError) {
        throw new MemoryError(e);
        // better yet:
        throw new MemoryError.apply(null, (Array)arguments);
    }
}
```
## Better `Date`s?!
as you know, JavaScript's Date object is quite cursed. so we will be replacing it with the temporal API!
```js
let {hour, minute} = Temporal.Now.plainTimeISO();
console.log()
```
you can also revert to legacy Date using 
```js
"for Date use legacy";
// if you want legacy mode for everything use
"use legacy";
// "use strict" is mutually exclusive with "use legacy"
"use strict"; //=>CoreConflictError: strict mode porhibits the use of legacy mode operations!
```
## I changed my mind.
### `Date` object will not be overritten
Temporal is annoying
```js
// get hours using Temporal API
Temporal.Now.plainTimeISO.hour; // 2 long bruh
// get hours using cursed Date object
new Date().getHours; // you're cursed and broken but that's why I love you.
```
## Buffer!
tf is Blob and file shyt? nah, Buffer is the buffiest of them all.
```java
Buffer.from("blob my ass");
// also arraybuffers
Buffer.from(Buffer.constructor.name).buffer
// no really
ArrayBuffer abf = new ArrayBuffer(16);
```
I mean, Buffer IS better but we love blobz too!
```js
let blob = new Blob(["I forgot", "how", "this thing works tbf"])
let file = new File(["I'm a sexier blob!"], {type: "text/plain"})
```
## type definition?!
wow! (im tired and cant type)
```c
typedef String Words;
typedef string Words;
typedef Words = String;
typedef Numbers = Number[];
```
## Reworked typeof
```js
typeof ""//=>String rather than string
typeof {}//=>Object rather than object
typeof new Date()//=>Date rather than object
```
## .toString() improvements
Object.prototype.toString() now returns output familiar to the one of JSON.stringify()
```java
Object obj = new Object({})
obj.toString()//=>no more [object Object] rather: {}
```
### Function.prototype.toString() print native code
native functions now no longer show:
```js
'function functionName() { [native code] }'
```
rather, it shows the actual low level source code for that function.
```js
Math.sort().toString()//=>
/*
void js_array_sort(char **arr, size_t n) {
    qsort(arr, n, sizeof(char *), js_sort_default);
}
*/
```
## 0 ÷ 0
it's a string that says `"NaN"`
## Functions!
js like functions:
```ts
// Promises too!
async function add(a : Number, b : Number) {
    return await chatGptAdd();
}
```
you can also use other methods!
```js
"use funtions"; // needs this for this to work
fun meow() {}
func meow() {}
def // no, shoo python
```
### typed functions!
```ts
float sum(a = 1f, b : float = 2.0f, b : Float = 3.0) {
    return<1> a+b+c;
}
```
### I can do it better than typescript!
```ts
param sum = {
    a: Number,
    b: Number
}
function sum(a, b) {
    return a+b;
}
```
## implementing the "java" in "javascript"
```java
class Main {
    public static void main(String[] args) {
        console::log(args.map(_=>null))
    }
}
```
then in shell
```sh
jspp --entrypoint Main args
#=> [null]
```
## Reworked Array.sort!
`[6,-2,-6,2].sort()` is now:
```js
[-6,-2,2,6]
```
rather than:
```js
[-2,-6,2,6]
```
## (`when` from DreamBerd/GulfOfMexico)
### listen to variable mutation! (like event listeners/signals)
```js
let counter;
counter = 8;
sense(counter) {
    if(counter) {
        console->log("counter is truthy!");
    }
}
```