// ast.types.ts

// 1. The Base Node
export interface ASTNode {
    type: string;
    line: number;
}

// 2. The Statements (Things that DO)
export interface VariableDeclaration extends ASTNode {
    type: "VariableDeclaration";
    // ... your properties
}

// 3. The Expressions (Things that RETURN)
export interface NumericLiteral extends ASTNode {
    type: "NumericLiteral";
    value: number;
}

// 4. The Master Union Type
// This is the magic trick. When your parser returns a node, 
// TypeScript knows it could be ANY of these shapes.
export type Statement = VariableDeclaration /* | IfStatement | LoopStatement */;
export type Expression = NumericLiteral /* | ArrayComprehension | Identifier */;

class Player {
     health = 100;
}

let ast_test = {
     "type": "Program",
     "body" : [
          {
               "type": "ClassDeclaration",
               "name": "Player",
               "body": [
                    {
                         "type": "VariableDeclaration",
                         "dataType": "int",
                         "name": "health",
                         "value": {
                              "type": "NumericLiteral",
                              "value": 100
                         }
                    }
               ]
          }
     ]
}