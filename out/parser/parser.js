"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("../lexer/tokenizer");
const tokenizer_types_1 = require("../lexer/tokenizer.types");
let str = "int a = 1;";
let currentPath = ["root"];
let ast_tree = {
    "type": "root",
    "body": []
}; // ignore ast for now, I want to tinker around 1st then make classes and stuff.
let base_types = ["int", "char", "float", "float", "double", "void"];
let tokens = (0, tokenizer_1.tokenize)(str);
parse(tokens);
function parse(tokens) {
    let i = 0;
    // peek tokens after w/o mutation
    const peek = (d = 0) => tokens[i + d];
    // consume one token and advance 
    const consume = () => tokens[i++];
    // expect X and cry if not X
    const expect = (type, text) => {
        const t = consume();
        if (t.type !== type || (text !== undefined && t.text !== text))
            throw new Error(`[${t.line}:${t.char}] Expected ${text ?? type}, got '${t.text}'`);
        return t;
    };
    // ??
    const at = (type, text, d = 0) => {
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
    }
    function isTypeStart() {
        return base_types.includes(peek().text);
    }
    function parseInferredDecl() {
        /*
        - Handeling Inferred Declaration
        i need to vomit ideas then sort them 🤪
        let a = ""; // primitive string or char[]
        const a: string = "";
        const a
        */
    }
    function parseExpr() { }
    function parseReturn() { }
    function parseClass() { }
    function parseStatement() {
        // let/var/const path
        let compounded_or = true;
        for (let inferrer of tokenizer_types_1.inferrers) {
            compounded_or ||= at("KEYWORD", inferrer);
        }
        if (compounded_or)
            return parseInferredDecl();
        // return
        if (at("KEYWORD", "return"))
            return parseReturn();
        // class
        if (at("KEYWORD", "class"))
            return parseClass();
        // explicit type path: int x ... / void foo() {} / pointer int p ...
        if (isTypeStart())
            return parseTypedDecl(); // dispatches to var or function
        throw new Error(`[${peek().line}:${peek().char}] Unexpected '${peek().text}'`);
    }
    const ast = [];
    while (i < tokens.length)
        ast.push(parseStatement());
    return ast;
}
//# sourceMappingURL=parser.js.map