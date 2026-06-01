"use strict";
// ast.types.ts
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    health = 100;
}
let ast_test = {
    "type": "Program",
    "body": [
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
};
//# sourceMappingURL=ast.types.js.map