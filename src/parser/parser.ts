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

// let tokens = tokenize(str);

// parse(tokens);

export function parse(tokens: JSPPToken[]) {
     let i = 0;

     let lastToken: JSPPToken;

     // peek tokens after w/o mutation
     const peek    = (d = 0): JSPPToken => tokens[i + d];
     // consume one token and advance 
     const consume = (): JSPPToken => {
          lastToken = peek();
          return tokens[i++]
     };
     // expect X and complain if not X
     const expect  = (type: JSPPTokenType, text?: string): JSPPToken => {
          const t = consume();
          if (t.type !== type || (text !== undefined && t.text !== text))
               throw new Error(`[${t.line}:${t.char}] Expected ${text ?? type}, got '${t.text}'`);
          return t;
     };
     // return token exists AND the type is the expected type AND has text
     const at = (type: JSPPTokenType, text?: string, d = 0): boolean => {
          const t = peek(d);
          return !!t && t.type === type && (text === undefined || t.text === text);
     };

     function consumeStatementEnd() {
          const current = peek();

          // Condition 1: They actually wrote a semicolon (Good programmer!)
          if (current.type === "SYMBOL" && current.text === ";") {
               consume();
               return;
          }

          // Condition 2: They pressed Enter!
          // If the current token is on a HIGHER line number than the last token we ate.
          if (lastToken && current.line > lastToken.line) {
               return; // Implicitly accept the end of the statement
          }

          // Condition 3: We hit a closing brace '}'.
          // Example: function() { return 5 } <- No semicolon needed before the brace.
          if (current.type === "SYMBOL" && current.text === "}") {
               return;
          }

          // Condition 4: End of File
          if (!current || current.type === "EOF") { // (Assuming you push an EOF token at the end)
               return;
          }

          // If none of these are true, they wrote invalid code (e.g., `let a = 5 let b = 10` on the same line)
          throw new Error(`Syntax Error: Unexpected token '${current.text}' at line ${current.line}. Expected ';' or a new line.`);
     }

     enum TypeType {
          NORMAL, NORMAL_FUNCTION, ANON_FUNCTION, ARRAY, POINTER
     }

     function parseType() {
          let dataType = consume().text; 
          // NORMAL=TYPE IDEN =
          // Illegal void var
          if(dataType === "void") {
               if(at("IDENTIFIER") && at("SYMBOL", "=", 1)) {
                    throw new Error(`[ERROR][parseType][${peek().line}:${peek().char}] Illegal void variable!`);
               }
          }
          // 3. (Temporary) Check for array brackets if we want to support int[] later
          // if (at("SYMBOL", "[")) { consume(); expect("SYMBOL", "]"); dataType += "[]"; }

          // 4. Expect the identifier (the variable name)
          let identifier = expect("IDENTIFIER").text;
          
          let value = null;

          // 5. Check for assignment
          if (at("SYMBOL", "=")) {
               consume(); // Eat the '='
               value = parseExpr("typed_decl"); // Grab the value
          }

          // 6. Ensure the statement safely terminates
          consumeStatementEnd();

          // 7. Return the structured AST node
          return {
               type: "VariableDeclaration",
               inferred: false,
               kind: dataType, // e.g., 'int'
               identifier: identifier,
               value: value
          };
     }

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
          console.log("{parseTypedDecl}");
          parseType();
          while(i < tokens.length && tokens[i].text !== ";") {
               console.log("Consumed token:", consume().text);
          }
          i++;
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
          console.log("{parseInferredDecl}");
          let accum = consume().text; // consume
          console.log("found inferred declaration: ", accum);
          return accum;

     }
     function parseExpr(where: string) { /* handles precedence climbing for operators */
          console.log("{parseExpr}");
          /*
           a =|...;|
          [] => either array definition
          */
          if(where === "t") {
               console.log("[parseExpr] expression is coming from a typed declaration");
          }
          return (
               at("NUMBER")||at("REGEX")||at("STRING")||
               at("SYMBOL", "[")||at("SYMBOL", "(") ? peek((i - i++)).text: "nothin");
     }
     function parseReturn() { console.log("{parseReturn}");return i++; }
     function parseClass() { console.log("{parseClass}");return i++; }
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