import { vscode_tokenize as tokenize } from '../lexer/tokenizer';
import chalk from 'chalk';

let input = "int a = 1;const"

console.log(`Input: "${input}\nOutput: `,tokenize(input));