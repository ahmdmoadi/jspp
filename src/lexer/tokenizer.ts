import * as fs from 'fs';
import { keywords } from '../outline.js';
import { 
     JSPPToken,
     JSPPTokenType,
     tokenTypes,
     VSC_JSPPToken,
     VSC_JSPPTokenType,
     keyword_control_t,
     storage_type_t
} from './tokenizer.types.js';

let accum_logs: any[] = [];

function tokenize(input: string): JSPPToken[] {

     accum_logs = []; // empty debug arr

     input = input.replace(/\r\n/g, "\n");

     // let lines = input.split("\n");

     let tokens: JSPPToken[] = [];
     let i = 0;

     let currentLine = 0;
     let currentChar = 0;

     let lines = () => {
          return input.split("\n");
     }

     while (i < input.length) {
          let char = input[i];

          // ignore comments
          if(input[i] === "/" && input[i+1] === "/") { // check for single-line comments
               const start = i;
               while(i < input.length && input[i] !== "\n") {
                    i++;
               }
               tokens.push({
                    "type": "COMMENT",
                    "text": input.substring(start, i),
                    "line": currentLine,
                    "char": currentChar
               });
               continue;
          }

          // 1. Track Newlines accurately!
        if (char === '\n') {
            currentLine++;
            currentChar = 0; // Reset character position on new line
            i++;
            continue;
        }

          if (/\s/.test(char)) {
               currentChar++;
               i++;
               continue;
          }

          if (/^\d/.test(char)) {
               const start = i; 
               const startChar = currentChar;
               while (i < input.length && /\d|\./.test(input[i])) {
                    i++;
                    currentChar++;
               }
               tokens.push({
                    type: "NUMBER",
                    text: input.substring(start, i),
                    line: currentLine,
                    char: startChar
               });
               continue;
          }
          // test for text
          if (/^[a-zA-Z_]/.test(char)) {
               let start = i;
               const startChar = currentChar;

               while (i < input.length && /^\w/.test(input[i])) {
                    i++;
                    currentChar++;
               };
               const text = input.substring(start, i);
               if (keywords.includes(text)) {
                    tokens.push({
                         type: "KEYWORD",
                         text,
                         line: currentLine,
                         char: startChar
                    });
               } else {
                    tokens.push({
                         type: "IDENTIFIER",
                         text,
                         line: currentLine,
                         char: startChar
                    });
               }
               continue;
          }

          if (char === '"' || char === "'") {
               const quoteChar = char;
               const start = i;
               const startChar = currentChar;
               i++; // Skip opening quote
               currentChar++;
               while (i < input.length) {
                    if (input[i] === "\\" && i + 1 < input.length) {
                        i += 2; // Skip the backslash and the next character
                        currentChar += 2;
                        continue;
                    }

                    if(input[i] === quoteChar) break;

                    i++;
                    currentChar++;
               }

               if (i >= input.length) {
                    let fetchdLine = lines()[currentLine];
                    let str = `${fetchdLine.substring(start,fetchdLine.length)}`
                    accum_logs.push(`Unterminated string literal starting at index ${start}\n${str}`);
               }

               i++; // Skip closing quote
               currentChar++;
               tokens.push({
                    type: "STRING",
                    text: input.substring(start, i),
                    line: currentLine,
                    char: startChar
               });
               continue;
          }

          // handle RegEx (feat. gemini)
          if (char === '/') {
               // 1. Grab the previous token (if it exists)
               const lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;

               // 2. The Context Check: Is this math?
               const isDivision = lastToken && (
                    lastToken.type === "IDENTIFIER" || 
                    lastToken.type === "NUMBER" || 
                    (lastToken.type === "SYMBOL" && [")", "]", "}"].includes(lastToken.text))
               );

               // 3. If it is NOT division, we parse the regex!
               if (!isDivision) {
                    let start = i;
                    let startChar = currentChar;
                    i++; // skip the opening '/'
                    currentChar++;

                    let isClosed = false;

                    // Loop until we find the closing '/' (ignoring escaped '\/'!)
                    while (i < input.length) {
                         if (input[i] === '\\') {
                              i += 2; // Skip escaped characters
                              currentChar += 2;
                              continue;
                         }
                         if (input[i] === '/') {
                              isClosed = true;
                              i++; // Skip the closing '/'
                              currentChar++;
                              break;
                         }
                         i++;
                         currentChar++;
                    }

                    if (!isClosed) {
                         throw new SyntaxError(`Unterminated regex literal at line ${currentLine}`);
                    }

                    // 4. Capture the flags (igmsuy)
                    while (i < input.length && /^[a-z]/.test(input[i])) {
                         i++;
                         currentChar++;
                    }

                    // 5. Push the glorious Context-Aware Regex Token
                    tokens.push({
                         type: "REGEX", // Or whatever custom type you map in VS Code
                         text: input.substring(start, i),
                         line: currentLine,
                         char: startChar
                    });
                    
                    continue; // Skip the rest of the loop and start fresh!
               }
               
               // If isDivision WAS true, we do absolutely nothing. 
               // The loop will just continue downward and hit your fallback SYMBOL pusher!
               }

          // catch-all swllowed as symbol
          tokens.push({
               type: "SYMBOL",
               text: char,
               line: currentLine,
               char: currentChar
          });
          i++;
          currentChar++;
     }
     printlogs();
     return tokens;
}
//FLAG:SEPERATE:0
import { SemanticTokensBuilder } from 'vscode-languageserver/node';

export function build_vscode_tokens(input: string) {
     const tokens = tokenize(input);
     const builder = new SemanticTokensBuilder();

     // --- PASS 1: Build the Symbol Table (Cache) ---
     // (Now properly OUTSIDE the main loop!)
     const knownClasses = new Set<string>();
     
     for (let j = 0; j < tokens.length - 1; j++) {
          // If we see 'class' followed by an identifier, memorize it!
          if (tokens[j].text === "class" && tokens[j+1].type === "IDENTIFIER") {
               knownClasses.add(tokens[j+1].text);
          }
     }

     // --- PASS 2: Assign Colors ---
     for(let i=0; i<tokens.length; i++) {
          let token = tokens[i];
          let vsc_type_idx = tokenTypes.indexOf("operator");

          if (token.type === "KEYWORD") { 
               (token.text === "new") ? vsc_type_idx = tokenTypes.indexOf("keyword_operator_new_t") :
               (keyword_control_t.includes(token.text)) ? vsc_type_idx = tokenTypes.indexOf("keyword_control_t") :
               vsc_type_idx = tokenTypes.indexOf("storage_type_t");

          } else if(token.type === "IDENTIFIER") { 
               let afternew = i>0 ? tokens[i-1].text === "new" : null;
               let funciden = i>0 ? tokens[i-1].text === "function" : null;
               
               (afternew) ? vsc_type_idx = tokenTypes.indexOf("class") :
               (knownClasses.has(token.text)) ? vsc_type_idx = tokenTypes.indexOf("class") :
               (funciden) ? vsc_type_idx = tokenTypes.indexOf("function") :
               (i<tokens.length-1 && tokens[i+1].text === "(") ? vsc_type_idx = tokenTypes.indexOf("function") :
               (keyword_control_t.includes(token.text)) ? vsc_type_idx = tokenTypes.indexOf("keyword_control_t") :
               (storage_type_t.includes(token.text))?vsc_type_idx = tokenTypes.indexOf("storage_type_t"):
               vsc_type_idx = tokenTypes.indexOf("variable");

          } else if (token.type === "STRING") {
               vsc_type_idx = tokenTypes.indexOf("string");
          } else if(token.type === "NUMBER") { 
               vsc_type_idx = tokenTypes.indexOf("number");
          } else if(token.type === "REGEX") {

               let lastSlash = token.text.lastIndexOf("/");

               // 1. handle lhs fwd slash (using absolute token.char!)
               vsc_type_idx = tokenTypes.indexOf("punctuation_definition_string_t");
               builder.push(token.line, token.char, 1, vsc_type_idx, 0);

               // 2. handle regex expression
               let bodyLength = lastSlash - 1;
               if (bodyLength > 0) {
                   vsc_type_idx = tokenTypes.indexOf("string_regexp_t");
                   builder.push(token.line, token.char + 1, bodyLength, vsc_type_idx, 0);
               }

               // 3. handle rhs fwd slash
               vsc_type_idx = tokenTypes.indexOf("punctuation_definition_string_t");
               builder.push(token.line, token.char + lastSlash, 1, vsc_type_idx, 0);

               // 4. handle regex flags (Fallback to keyword safely)
               let flagsLength = token.text.length - (lastSlash + 1);
               if (flagsLength > 0) {
                   vsc_type_idx = tokenTypes.indexOf("keyword");
                   builder.push(token.line, token.char + lastSlash + 1, flagsLength, vsc_type_idx, 0);
               }
               continue;
          } else { 
               vsc_type_idx = tokenTypes.indexOf("operator");
          }
          
          // Push the token ONLY IF it wasn't already pushed by the Regex block
          builder.push(token.line, token.char, token.text.length, vsc_type_idx, 0);
     }
     
     return builder.build();
}

export { tokenize };

function addlog(...args: any[]) {
     accum_logs.push(args);
     // fs.writeFileSync("./tokenizer.ts.log",JSON.stringify(args,null,2));
}

function printlogs() {
     fs.writeFileSync("./tokenizer.ts.log.json",JSON.stringify(accum_logs,null,2));
}