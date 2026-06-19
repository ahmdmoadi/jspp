import { tokenize } from "../lexer/tokenizer";
import {
     JSPPToken,
     JSPPTokenType,
     inferrers
} from "../lexer/tokenizer.types";

let str = "int a = 1;";
let currentPath = ["root"];
let ast_tree = {
     "type": "root",
     "body": [

     ]
}; // ignore ast for now, I want to tinker around 1st then make classes and stuff.

let base_types = ["int", "char", "float", "float", "double", "void"];

let tokens = tokenize(str)

parse(tokens);

export function parse(tokens: JSPPToken[]) {
     let i = 0;

     // peek tokens after w/o mutation
     const peek    = (d = 0): JSPPToken => tokens[i + d];
     // consume one token and advance 
     const consume = (): JSPPToken => tokens[i++];
     // expect X and complain if not X
     const expect  = (type: JSPPTokenType, text?: string): JSPPToken => {
          const t = consume();
          if (t.type !== type || (text !== undefined && t.text !== text))
               throw new Error(`[${t.line}:${t.char}] Expected ${text ?? type}, got '${t.text}'`);
          return t;
     };
     // ??
     const at = (type: JSPPTokenType, text?: string, d = 0): boolean => {
          const t = peek(d);
          return !!t && t.type === type && (text === undefined || t.text === text);
     };

     function parseTypedDecl() {
          /* handles int, pointer int, int[], void(), Student[] ... */

          /*
          - base
          int name = // integer
          int() name // alternate function (lambda/anonymous) returning an integer
          int name( // function returning an integer

          - array related
          int[] name = // integer array variable
          int[]() name // alternate function (lambda/anonymous) retuning an integer array
          int[] name( // function returning an integer array

          - pointers definition
          int* name = // pointer to integer
          int *name = // == but warn with (-Wstarstruck)
          */
         return 0;
     }
     function isTypeStart() {
          return base_types.includes(peek().text);
     }
     function parseInferredDecl() {
          /*
          - Handeling Inferred Declaration
          let a = ""; // primitive string or char[]
          const a = 9; // primitive int
          let a = 9.; // primitive double
          let a = 9d; // primitive double
          let a = 9f; // primitive float
          let a = true; // primitive bool
          let a; // equiv to int a; or maybe should be size_t a?
          a; // equiv to int a; self defining variables. // will error unless #cf:ii:on; is implied
          // #cf:ii:on = CompilerFlags:ImplicitIntegerdefinition:ON
          //  can be changed by (maybe dropping $ from lazy syntax while at it)
          //  and doing: s$on;s$bool #cfii:on;a;++a;++a;return,a*sizeof(&a);$sss:bool;b;!b;return,b;
          */
          let accum = "";
          accum += consume().text;
          accum += consume().text;
          accum += consume().text;
          console.log("found inferred declaration: ", accum);
          return accum;
     }
     function parseExpr() { /* handles precedence climbing for operators */ return 0; }
     function parseReturn() { return 0; }
     function parseClass() { return 0; }
     function parseStatement() {
          // let/var/const path
          let compounded_or = false;
          for(let inferrer of inferrers) {
               compounded_or ||= at("KEYWORD", inferrer);
          }
          if (compounded_or) return parseInferredDecl();

          // return
          if (at("KEYWORD", "return")) return parseReturn();

          // class
          if (at("KEYWORD", "class")) return parseClass();

          // explicit type path: int x ... / void foo() {} / pointer int p ...
          if (isTypeStart()) return parseTypedDecl(); // dispatches to var or function
          
          throw new Error(`[${peek().line}:${peek().char}] Unexpected '${peek().text}'`);
     }

     const ast = [];
     while (i < tokens.length) ast.push(parseStatement());// parseStatement()
     return ast;
}