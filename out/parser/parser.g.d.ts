import { JSPPToken } from '../lexer/tokenizer.types';
export type NodeType = "Program" | "ClassDeclaration" | "Property" | "Method";
export interface ASTNode {
    type: NodeType;
}
export interface Program extends ASTNode {
    type: "Program";
    body: ASTNode[];
}
export declare class Parser {
    private tokens;
    private pos;
    constructor(tokens: JSPPToken[]);
    private peek;
    private consume;
    private expect;
    parse(): Program;
}
