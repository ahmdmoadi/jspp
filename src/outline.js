////////////////
// outline.js //
//////////////////////////////////////////
// this file is used for notes/drafting //
//////////////////////////////////////////

const input = "int varname = 2;";

let typesizes_b = {
     int: 32,
     char: 8,
     float: 32,
     pointer: 64,
     long: 64
}

let keywords = [
     "let", // dynamic/java "var" variable declaration. let
     "var",
     "const",
     "int", // 4byte / 32 bit integer
     "string",
     "unsigned",
     "function", // function functName(void?) {} same as void functName(void?) {}
     "void",
     "arguments",
     "instanceof",
     "delete",
     "alloc",
     "address",
     "addressat",
     "pointer",
     "is",
     "in",
     "arguments",
     "static",
     "private",
     "new",
     "class",
     "return",
     "public",
     "async",
     "await"
];

let rel_int = {
     as_var_type: "int i = 0;",
     in_casting: "(int)10.23",
     in_type_convertion: "int(10.23)"
};

let rel_pointer = {
     in_var_defi: "int* numptr = &num;", // retain c syntax here
     in_var_defi_dont_like: "int *numptr = &num;", // warn for confusing syntax (-Wno-starstruck to silence)
     in_var_defi2: "int* numptr = addressof num;",
     deref1: "@numptr",
     deref2: "*numptr", // also warn for confusing syntax and encourage using @ptr to deref (also -Wno-starstruck to silence)
     deref_verbose: "at numptr",
}

let rel_char = {
     in_var_defi: "char a = 'a'; ", // single or dbl quotations marks don't matter.
     /*
     
     var a = 'a'; char
     var a = "a"; char
     var a = "ab"; string
     var a = 'ab'; string
     char a = 'ab'; error
     string a = 'a'; string

     */
    in_casting: "(char)onechar_string", // cnvrts2char. recommended method of changing types.
    in_type_convertion: "char(onechar_string)"
}

let operators = [
     // Arithmetic
     "+", "-", "*", "/", "%", "++", "--",
     // Relational
     "==","===","!=",">","<",">=","<=",
     // Logical
     "&&", "||", "!",
     // Bitwise
     "&","|","^","~","<<",">>",
     // Assignment
     "=","+=","-=","*=","/=","%=","&=","|=","^=","<<=",">>=",
     // Member and pointer
     "*", "[", "]", "&", "@",
]

// balloc will be stored internally in bytes/chars-esques and toggled by bit operations
// i will probably store x possible bytes of these bits using
// either something like: #define BITE_CACHE_SIZE 1 or custom: #bitcache 1
// we will use these to toggle like dis
// int address = 0;
// BYTECACHE[((address-(address%8))/8)] ^= (1 << 4);
// thinking about it, having a bit sized type is a recipe for disaster
// i will probably throw this idea away.

let rel_alloc = {
     del: "delete ptr;",
     alloc: "alloc 4 ptr;", // allocate 4 bytes as ptr
     balloc: "balloc 1 ptr;", // allocate 1 bit (for whatever f*cking reason) (bools?)
     in_typedef: "typedef alloc 4 int_t", // or use in typedef as `typedef alloc/balloc BYTES/BITES TYPEDEF_NAME`
}

let rel_arr_destructuring = {
     withSkip: "let [...3, ...4 as next4elems] = arr;",
     withSkip2: "let [...3, ...rest] = arr;",
     withSkipAndSmartSizing: "let [...3, ...data, ...4 as trailer] = arr;",
     smartSizing: "let [...firstHalf, ...secondHalf] = arr;", // errors if length isn't divisable by spread count
}

let rel_arr_definition = { // do I promote first elem in: float a[] = [1,2.0] or throw error? idk
     regular: "let arr = [2,3,4]",
     regularExplicitTyping: "int arr = [2,3,4]",
     regularExplicitTyping: "Student[] allStudents = [2,3,4]",// can i do both Type[] arr = []; and Type arr[] = []; or both: Type[] arr[] = []? is it possible?
     group: "let groupedUp = [...4 of imageData.data] = ", //=> [[0,0,0,1],[0,0,0,1]] etc debating syntax but I  like it
     
}

let rel_arr_comprehension = {
     _: "int[] arr = [2,3,4,5,6,7,8,9];",
     doubleExample: "int dblOfArr = [for let x of arr do x*2]",
     filterDividableBy3: "int[] divdblBy3 = [for let x of arr if x % 3 == 0 do x]",
     filterDividableBy3Minimal: "int[] divdblBy3 = [for let x of arr if x % 3 == 0]",
     nestedIterations: "int[] cartesianProd = [for let x of A for let y of B do x + y]",
     tupleDestructuring: "int tupleDestr = [for let [x, y] of coordinates do x * y]",
     multiplyByIndex: "int[] idk = [for let x,i of arr do i*x]", // for of, the last variable is always the index, and the reverse is correct for for in. example: [for let x,i of arr do EXPRESSION] i is index here, [for let x,i in arr do EXPRESSION] x is index here and i is gonna be the 'of' element value
     turnIntoObj: "{for let name of names do name: name.length}",
     grouping: "let grouped = [...[4] of imageData.data]", // I like this syntax but seems risky, who knows
     nestedArrayComprehensionInsideGroupingSyntax: "int[] rArr=[];"+
               "int[] gArr = [];"+
               "int[] bArr = [];"+
               "int[] aArr = [];"+
               "let grouped = [...[4 as [r,g,b,a]] do rArr.push(r);gArr.push(g);bArr.push(b);aArr.push(a)] of imageData.data]", // groups array into 4 element subArrays and puts every color in an array. I never mentioned this but all arrays are 0 initialized and can be dynamic if no size if provided.
}
let rel_forevery = {
     _: "forevery(4 in imgData.data as color) { do something with color array }"
}

let rel_lambda = {
  "js_template_VARDEF":"let stringToError = function(msg) {return new Error(msg)}",
  "ts_template_lambda":`
  function doSomething(onerror: (msg: string) => void) {
     onerror("bad ting happen");
  }
  doSomething((msg: string) => {
     throw new Error(msg);   
  });
  `,
  "my_lambda": `
  void doSomething(void() onerror(string msg)) {
     onerror("bad ting happen");
  }
  doSomething(void() (string msg) {
     throw new Error(msg);   
  });
  `,
  "as_variable":`void() sayhi = void() (string msg) {}`
}

let rel_for = {
  "classic": "for(let i=0;i<10;i++){/* 10 times. 0 <= i < 10 */}",
  "blind_repetition": "for(10){} // 10 times aswell. no indicies",
  "math_ineq": "for(1 <= int i <= 10)", // by default i++ / i+=1;
  "math_ineq_with_step": "for(1 <= int i <= 10; i+=3)", // if semicolon and wrong/no step then throws SyntaxError
}

let rel_class = {
     "with_getter_setter": `
     class Person {
          public static int hijriDiff = 1; // bad approx. used only for demo purposes
          public int age = 0;
          string name = ""; // public by default.
          constructor(string name, int age) {
               this.name = name;
               this.age = age;
          }
          set age(x) {
               this.age = x;
               return x;
          }
          get age {return age}
          get hijriAge {return age+hijriDiff}
     }
     `,
     "with_operator_overloading": `
     class v2 {
          int x = 0;
          int y = 0;
          constructor(...float numbers) {
               if(numbers.length == 1) {
                    this.x = numbers[0];
                    this.y = numbers[0];
               }
          }
          // op. overl. below covers: 'pos * 3.0f'
          operator<this*float>(float scaler) {
               this.x *= scaler;
               this.y *= scaler;
          }
          // op. overl. below covers: '3.0f * pos'
          operator<float*this>(float scaler) {
               throw new Error("Illegal order of expression. did you mean 'v2 * float' ?");
          }
          get xx() {
               return vec2(this.x,this.x)
          }
     }
     `
}

let rel_lazy_types = {
     decl: "lazy int a = 6969;",
     decl2: "int$ a = 6969;",
     usageDuh: "a",
     practical_use: `
     bool OR(lazy bool a, bool$ b) {
          return !!a ? a : b;
     }
     `,
     errorwhen: "lazy bool a() {}; //or// lazy bool() a = lazy bool() () {} // ERROR: explicit lazy functions are illegal since functions are lazy in origin!",
}

let rel_string = {
     clike: 'char name[] = "myName";',
     string_type: 'string name = "maename";',
     empty: 'string bakery; // 1 byte capacity and length (to store nullterm {0})',
     empty2: 'string bakery = ""; // 1 byte capacity and length (to store nullterm {0})',
     clike_empty: 'char bakery[] = ""; // 1 byte capacity and length (to store nullterm {0})',
     clike_empty2: 'char* bakery = ""; // 1 byte capacity and length (to store nullterm {0})',
     pseudo_methods: 'name.length // equiv to: lazy size_t length = strlen(name);'
}

let future_bucket_list = {
     "idk": 'int() dbl = await extern "C" int() (x) `int`',
     "async": "await"
}

let misc = `
// #cf:ii:on = CompilerFlags:ImplicitIntegerdefinition:ON
//  can be changed by (maybe dropping $ from lazy syntax while at it)
//  and doing: s$on;s$bool #cfii:on;a;++a;++a;return,a*sizeof(&a);$sss:bool;b;!b;return,b;

/*
     - Handeling Inferred Declaration
     let a = ""; // primitive string or char[]
     const a = 9; // primitive int
     let a = 9.; // primitive double
     let a = 9d; // primitive double
     let a = 9f; // primitive float
     let a = true; // primitive bool
     let a; // equiv to void* a; 8 byte pointer.
     */
`;

export {
     keywords
}