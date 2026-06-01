"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("../lexer/tokenizer");
const chalk_1 = __importDefault(require("chalk"));
let input = "int a = 1;const";
console.log(`Input: "${input}\nOutput: `, (0, tokenizer_1.vscode_tokenize)(input));
//# sourceMappingURL=test.js.map