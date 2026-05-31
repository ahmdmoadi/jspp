```js
// jspp code

// goals:
/*
- merge js and c syntax into a language that can be compiled and interpreted, however we'll focus on interpretation first.
- add more verbose alternatives to some of the confusing c's way of doing things
like in pointer definition:
int *numptr = &num;
int *numptr = addressat num;
pointer int numptr = &num;
pointer int numptr = addressat num;
address int numptr = &num;
address int numptr = addressat num;
-- dereferencing
int num2 = @numptr;
int num2 = @11345; // hardcode memory address (useful for implementing low level with a restricted known/gettable memory address range)
like now struct->member can be *struct.member / @struct.member
*/

let number = 9;
number dbl() {
     return number*2;
}

typedef struct {
     string name;
} Person;

// void and function are the same.
void sayHae() { print(`{me.name}`); }

//OLD ITER
class Vec2 {
//public float x; public by default
float x;
float y;
constructor(...Number) {// there will be a === but not the same as js. === will only match exact same (usings pointers?)
if(arguments.length == 0) {fprintf(stdout, "Error: one or two arguments is required.", 1);} else if(arguments.length == 1) {
this.x = arguments[0];
this.y = arguments[1];
}
}
operation<+>(value, side) { return this.x+}
set this(x) {}
get(x) {return this}
}
```
- for Number it's prolly something like `type Number = int | float;`. it's user defined. also compiler/interpreter will choose the one with the bigger type and then allocate of that size.
language is in early dev and is in the theory stage. I only partially wrote the lexer with your help
an unholy mix of js , ts, c, c++-esque, and java.

```js
//END OLD ITER
// ITER
constructor(...Number numbers, ...String strings) {
number = (float)numbers; // casting a multitype promotes all members to new type, frees old memory of mixed type and reallocs for new type. same thing also when casting an array of one type.
int len = numbers.length; // length computed at parsing stage? compiler/interpreter counts arguments.
float accum = 0; // doesn't scream and autoconverts to 0.0
for(int i=0;i<len;i++) {
accum += numbers[i];
}
for(int i=0;i<strings.length;i++) {
printf(strings[i]);
}
}

// ITER
macro length(x) = (sizeof(x)/sizeof((x)[0]));
```

// KOTLIN syntax
```kotlin
fun getStringLength(obj: Any): Int? {
     if(obj is String) {
          // 'obj' is automatically cast to string in this branch
          return obj.length
     }

     // 'obj' is still of type 'Any' outside the type-checked branch
     return null;
}
```