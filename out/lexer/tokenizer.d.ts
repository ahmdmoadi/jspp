import { JSPPToken } from './tokenizer.types.js';
declare function tokenize(input: string): JSPPToken[];
export declare function build_vscode_tokens(input: string): import("vscode-languageserver-types").SemanticTokens;
export { tokenize };
