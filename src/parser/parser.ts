import { tokenize } from "../lexer/tokenizer";
import {
     JSPPToken,
     JSPPTokenType,
     inferrers
} from "../lexer/tokenizer.types";

const B = "\x1b[1m";
const O = "\x1b[0m";

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

export function parse(tokens: JSPPToken[], input: string) {
     let i = 0;

     let lastToken: JSPPToken;
     let prevToken: JSPPToken;

     // peek tokens after w/o mutation
     const peek    = (d = 0): JSPPToken => tokens[i + d];
     // consume one token and advance 
     const consume = (): JSPPToken => {
          prevToken = i > 1 ? tokens[i-1] : tokens[0];
          const t = tokens[i++]; // Grab the token and increment 'i' in one step
          lastToken = t;         // Save it for ASI
          return t;              // Hand it to the parser
     };
     // expect X and complain if not X - MUTATES
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

     // enum TypeType {
     //      NORMAL, NORMAL_FUNCTION, ANON_FUNCTION, ARRAY, POINTER
     // }

     // --- 1. Primary Expressions (Numbers, Strings, Identifiers, Regex, Grouping) ---
     function parsePrimary(): any {
          const t = consume();

          if (t.type === "NUMBER") {
               // Safely strip the underscores for the interpreter!
               return { type: "NumericLiteral", value: parseFloat(t.text.replace(/_/g, "")) };
          }
          if (t.type === "IDENTIFIER") {
               return { type: "Identifier", symbol: t.text };
          }
          if (t.type === "STRING") {
               return { type: "StringLiteral", value: t.text };
          }
          if (t.type === "REGEX") {
               return { type: "RegexLiteral", value: t.text };
          }
          if (t.type === "SYMBOL" && t.text === "(") {
               let value = parseExpr("parenthesis");
               expect("SYMBOL", ")"); // Eat the closing brace
               return value;
          }

          throw new Error(`[${t.line}:${t.char}] Unexpected token '${t.text}' in expression.`);
     }

     // --- 2. Multiplicative (*, /, %, **) ---
     function parseMultiplicative() {
          let left = parsePrimary();

          while (at("SYMBOL", "*") || at("SYMBOL", "/") || at("SYMBOL", "%") || at("SYMBOL", "**")) {
               const operator = consume().text;
               const right = parsePrimary();
               left = {
                    type: "BinaryExpr",
                    operator: operator,
                    left: left,
                    right: right
               };
          }
          return left;
     }

     // --- 3. Additive (+, -) ---
     function parseAdditive() {
          let left = parseMultiplicative();

          while (at("SYMBOL", "+") || at("SYMBOL", "-")) {
               const operator = consume().text;
               const right = parseMultiplicative();
               left = {
                    type: "BinaryExpr",
                    operator: operator,
                    left: left,
                    right: right
               };
          }
          return left;
     }

     ////////////////////////////////////////////ME SPOT LONG LINE///////////////////////////////////////////////////
     // --- 4. The Main Expression Router ---
     function parseExpr(what: string) {
          console.log(`[INFO][parseExpr] called from ${what}`);

          // parenthesis typecastto_TYPE inferred_decl typed_decl return
          
          // Start at the lowest precedence level you currently support
          return parseAdditive();
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
          // Check for array brackets if we want to support int[] later
          if (at("SYMBOL", "[")) {
               consume();
               expect("SYMBOL", "]");
               dataType += "[]";
          }

          if (at("SYMBOL", "*")) {
               // see where the star is anchored to, check lastToken.char+lastToken.text.length === current.char
               let current = consume();
               console.log(prevToken, current);
               let attached = prevToken.char+prevToken.text.length === current.char;
               if(!attached) console.warn(`[WARN][parseType]:${current.line}:${current.char} ${dataType}* IDENTIFIER is preferred over ${dataType} *IDENTIFIER. [-Wstarstruck]`);
               dataType += "*";
          }

          // Expect the identifier (the variable name). int >a<
          let identifier = expect("IDENTIFIER").text;
          
          // VALUE / EXPR ETC FROM BELOW ON
          let value = null;

          // Check for assignment. int a >=<
          if (at("SYMBOL", "=")) {
               consume(); // Eat the '='
               value = parseExpr("typed_decl"); // Grab the value
          }

          // Ensure the statement safely terminates
          consumeStatementEnd();

          // Return the structured AST node
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
     // function parseExpr(where: string) { /* handles precedence climbing for operators */
     //      console.log(`[INFO][parseExpr] called from ${where}`);
     //      const t = consume();
     //      return {type: "Literal", value: t.text}
     // }
     function parseTypeCast() {
          console.log(`[INFO][parseTypeCast]`);
          consume(); // consume (
          const typeToken = consume();
          consume(); // consume )
          return parseExpr(`typecastto_${typeToken.text}`)
     }
     function parseReturn() {
          console.log("[INFO][parseReturn]");

          consume(); // consume "return"

          let value = null;

          // parse expression of return statement
          while(!at("SYMBOL", ";") && !at("SYMBOL", "}")) {
               value = parseExpr("return");
          }

          consumeStatementEnd(); // consume ;}EOF

          return {
               type: "ReturnExpr",
               value
          }
     }
     function parseClass() { console.log("{parseClass}");return i++; }
     ////////////////////////////////////////PARSING ENTRYPOINT//////////////////////////////////////////////
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

          // handle type casting                                      \/ so I can include classes/typedef etc later
          if(at("SYMBOL", "(") && at("KEYWORD", undefined, 1) && [...base_types].includes(peek(2).text))
               return parseTypeCast();
          
          // throw new Error(`[${peek().line}:${peek().char}] Unexpected '${peek().text}'`);
          throw new Error(errorPointer(input, peek().line, peek().char, "parseStatement", `Unexpected token '${peek().text}':`));
     }

     const ast = [];
     while (peek().type !== "EOF") ast.push(parseStatement());// parseStatement()
     return ast;
}

export function errorPointer(
     input: string,
     line: number,
     index: number,
     from: string = "GLOBAL",
     msg: string = "ERROR at:",
     logtype: string = "ERROR",
     file: string = "_PARSER_TMP"
) {
     // User@DESKTOP-K3M3HOQ MINGW64 ~/Desktop/pro/js-interpreter/debug
     // $ gcc afile.c -Wall
     // afile.c: In function 'main':
     // afile.c:4:10: warning: unused variable 'unUseD' [-Wunused-variable]
     // 4 |      int unUseD = 0;
     //      |          ^~~~~~
     return `[${logtype}][${from}]:\n`
          +`${B}${file}:${O} In function ${B}'${from}${O}':\n`
          +`${B}${file}:${line}:${index}:${O} ${msg}\n`
          +`${" ".repeat(5-line.toString().length)}${line} | ${getLine(input,line)}\n`
          +`      | ${" ".repeat(index)}^`;
}

function getLine(input: string, line: number) {
     return input.split("\n")[line];
}

function reconstruct_input(tokens: JSPPToken[]): string {
     // let attached = prevToken.char+prevToken.text.length === current.char;
     if(!tokens || tokens.length === 0) return "";

     let accum = "";
     let currentLine = tokens[0].line;
     let pointer = tokens[0].char;

     for(let i = 0; i < tokens.length; i++) {
          let current = tokens[i];

          if (current.type === "EOF") continue;

          // handle newlines
          if(currentLine < current.line) {
               let lineDiff = current.line - currentLine;
               accum += "\n".repeat(lineDiff);
               currentLine = current.line;
               pointer = 0;
          }

          // handle spaces
          let spaceCount = current.char - pointer;
          if (spaceCount > 0) accum += " ".repeat(spaceCount);

          accum += current.text;

          pointer = current.char + current.text.length;
     }
     return accum;
}