"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("../lexer/tokenizer");
let str = "int a = 1;";
let currentPath = ["root"];
let ast_tree = {
    "type": "root",
    "body": []
};
function howdidwegethere(str) {
    let token = (0, tokenizer_1.tokenize)(str);
    // check keyword then do this hit
}
//# sourceMappingURL=parser.js.map