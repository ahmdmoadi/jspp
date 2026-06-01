"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_vscode_tokens = build_vscode_tokens;
exports.tokenize = tokenize;
const fs = __importStar(require("fs"));
const outline_js_1 = require("../outline.js");
const tokenizer_types_js_1 = require("./tokenizer.types.js");
let accum_logs = [];
function tokenize(input) {
    input = input.replace(/\r\n/g, "\n");
    // let lines = input.split("\n");
    let tokens = [];
    let i = 0;
    let currentLine = 0;
    let currentChar = 0;
    while (i < input.length) {
        let char = input[i];
        // ignore comments
        if (input[i] === "/" && input[i + 1] === "/") { // check for single-line comments
            const start = i;
            while (i < input.length && input[i] !== "\n") {
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
            }
            ;
            const text = input.substring(start, i);
            if (outline_js_1.keywords.includes(text)) {
                tokens.push({
                    type: "KEYWORD",
                    text,
                    line: currentLine,
                    char: startChar
                });
            }
            else {
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
                i++;
                currentChar++;
                if (input[i] === quoteChar)
                    break;
            }
            if (i >= input.length) {
                throw new SyntaxError(`Unterminated string literal starting at index ${start}`);
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
            const isDivision = lastToken && (lastToken.type === "IDENTIFIER" ||
                lastToken.type === "NUMBER" ||
                (lastToken.type === "SYMBOL" && [")", "]", "}"].includes(lastToken.text)));
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
    return tokens;
}
//FLAG:SEPERATE:0
const node_1 = require("vscode-languageserver/node");
function build_vscode_tokens(input) {
    const tokens = tokenize(input);
    const builder = new node_1.SemanticTokensBuilder();
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("operator");
        // --- PASS 1: Build the Symbol Table (Cache) ---
        const knownClasses = new Set();
        for (let i = 0; i < tokens.length - 1; i++) {
            // If we see 'class' followed by an identifier, memorize it!
            if (tokens[i].text === "class" && tokens[i + 1].type === "IDENTIFIER") {
                knownClasses.add(tokens[i + 1].text);
            }
        }
        if (token.type === "KEYWORD" /**&& token.text === "int"*/) { // hightlight keywords >function< dbl(){}
            (token.text === "new") ? vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("keyword_operator_new_t") :
                (tokenizer_types_js_1.keyword_control_t.includes(token.text)) ? vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("keyword_control_t") :
                    vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("storage_type_t");
        }
        else if (token.type === "IDENTIFIER") { // highlight identifiers (e.g. int >number< = 0;)
            let afternew = i > 0 ? tokens[i - 1].text === "new" : null;
            let funciden = i > 0 ? tokens[i - 1].text === "function" : null;
            (afternew) ? vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("class") :
                (knownClasses.has(token.text)) ? vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("class") :
                    (funciden) ? vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("function") :
                        (tokenizer_types_js_1.keyword_control_t.includes(token.text)) ? vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("keyword_control_t") :
                            (tokenizer_types_js_1.storage_type_t.includes(token.text)) ? vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("storage_type_t") :
                                vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("variable");
            // throw new EvalError(`Error: Unmapped token type ${token.type}!`)
        }
        else if (token.type === "STRING") {
            vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("string");
        }
        else if (token.type === "NUMBER") { // highlight numbers >99<
            vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("number");
            // FLAG REGEX
        }
        else if (token.type === "REGEX") {
            // addlog(token.text);
            accum_logs = [];
            let arr = [];
            // handle lhs fwd slash
            vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("punctuation_definition_string_t");
            builder.push(token.line, token.text.indexOf("/"), 1, vsc_type_idx, 0);
            arr.push("/");
            // handle regex expression
            vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("string_regexp_t");
            let regexText = token.text.substring(token.text.indexOf("/") + 1, token.text.lastIndexOf("/"));
            builder.push(token.line, token.text.indexOf("/") + 1, regexText.length, vsc_type_idx, 0);
            arr.push(regexText);
            // handle rhs fwd slash
            vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("punctuation_definition_string_t");
            builder.push(token.line, token.text.lastIndexOf("/"), 1, vsc_type_idx, 0);
            arr.push("/");
            // handle regex flags
            let ss = token.text.substring(token.text.lastIndexOf("/") + 1, token.text.length);
            vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("regex_flags_t");
            builder.push(token.line, token.text.lastIndexOf("/") + 1, ss.length, vsc_type_idx, 0);
            arr.push(ss);
            accum_logs.push(arr);
        }
        else { // fallback
            vsc_type_idx = tokenizer_types_js_1.tokenTypes.indexOf("operator");
        }
        let { type, text, line, char } = token;
        builder.push(line, char, text.length, vsc_type_idx, 0);
    }
    printlogs();
    return builder.build();
}
function addlog(...args) {
    accum_logs.push(args);
    // fs.writeFileSync("./tokenizer.ts.log",JSON.stringify(args,null,2));
}
function printlogs() {
    fs.writeFileSync("./tokenizer.ts.log.json", JSON.stringify(accum_logs, null, 2));
}
//# sourceMappingURL=tokenizer.js.map