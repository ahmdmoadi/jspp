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
          let dataType = consume().text; 
          // NORMAL=TYPE IDEN =
          // Illegal void var
          if(dataType === "void") {
               if(at("IDENTIFIER") && at("SYMBOL", "=", 1)) {
                    throw new Error(`[ERROR][parseType][${peek().line}:${peek().char}] Illegal void variable!`);
               }
          }
          // 3. (Temporary) Check for array brackets if we want to support int[] later
          if (at("SYMBOL", "[")) {
               consume();
               expect("SYMBOL", "]");
               dataType += "[]";
          }

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
          console.log("[INFO][parseTypedDecl]");
          return parseType();
     }
     function isTypeStart() {
          return base_types.includes(peek().text);
     }
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
     function parseInferredDecl() {
          console.log("[INFO][parseInferredDecl]");
          
          // 1. Eat the keyword (let, const, var)
          let declType = consume().text; 
          
          // 2. Expect an identifier (the variable name)
          let identifier = expect("IDENTIFIER").text;
          
          let value = null;

          // 3. Check for assignment
          if (at("SYMBOL", "=")) {
               consume(); // eat the '='
               value = parseExpr("inferred_decl"); // grab the value
          }

          // 4. Ensure the statement safely terminates (; or newline)
          consumeStatementEnd();

          // 5. Return the Plain Object AST Node
          return {
               type: "VariableDeclaration",
               inferred: true,
               kind: declType,
               identifier: identifier,
               value: value
          };
     }
     function parseExpr(where: string) { /* handles precedence climbing for operators */
          console.log(`[INFO][parseExpr] called from ${where}`);
          const t = consume();
          return {type: "Literal", value: t.text}
     }
     function parseReturn() { console.log("{parseReturn}");return i++; }
     function parseClass() { console.log("{parseClass}");return i++; }
     function parseStatement() {
          // let/var/const path
          if (at("KEYWORD") && inferrers.includes(peek().text)) {
               return parseInferredDecl();
          }

          // return
          if (at("KEYWORD", "return")) return parseReturn();

          // class
          if (at("KEYWORD", "class")) return parseClass();

          // explicit type path: int x ... / void foo() {} / pointer int p ...
          if (isTypeStart()) return parseTypedDecl(); // dispatches to var or function
          
          throw new Error(`[${peek().line}:${peek().char}] Unexpected '${peek().text}'`);
     }

     const ast = [];
     while (peek().type !== "EOF") ast.push(parseStatement());// parseStatement()
     return ast;
}