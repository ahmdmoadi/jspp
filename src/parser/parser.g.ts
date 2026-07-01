import { JSPPToken } from '../lexer/tokenizer.types';

// 1. --- The AST Node Definitions ---
export type NodeType = "Program" | "ClassDeclaration" |
                         "Property" | "Method" | "BinaryExpr" |
                         "NumericLiteral" | "Identifier" |
                         "StringLiteral" | "RegexLiteral";

export interface ASTNode {
    type: string/* NodeType */;
}

export interface Program extends ASTNode {
    type: "Program";
    body: ASTNode[];
}

export interface BinaryExpr extends ASTNode {
     type: "BinaryExpr",
     operator: string,
     left: ASTNode,
     right: ASTNode
}