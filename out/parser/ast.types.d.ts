export interface ASTNode {
    type: string;
    line: number;
}
export interface VariableDeclaration extends ASTNode {
    type: "VariableDeclaration";
}
export interface NumericLiteral extends ASTNode {
    type: "NumericLiteral";
    value: number;
}
export type Statement = VariableDeclaration;
export type Expression = NumericLiteral;
