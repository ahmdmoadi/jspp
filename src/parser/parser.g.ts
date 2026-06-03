import { JSPPToken } from '../lexer/tokenizer.types';

// 1. --- The AST Node Definitions ---
export type NodeType = "Program" | "ClassDeclaration" | "Property" | "Method";

export interface ASTNode {
    type: NodeType;
}

export interface Program extends ASTNode {
    type: "Program";
    body: ASTNode[];
}

// 2. --- The Parser Class ---
export class Parser {
    private tokens: JSPPToken[];
    private pos: number = 0;

    constructor(tokens: JSPPToken[]) {
        this.tokens = tokens;
    }

    // Helper: Look at the current token without moving forward
    private peek(): JSPPToken {
        return this.tokens[this.pos];
    }

    // Helper: Grab the token and move forward
    private consume(): JSPPToken {
        return this.tokens[this.pos++];
    }

    // Helper: Crash the compiler if the token isn't what we expect
    private expect(type: string, text?: string): JSPPToken {
        const token = this.peek();
        if (token.type !== type || (text && token.text !== text)) {
            throw new Error(`Syntax Error: Expected ${text || type} but found ${token.text}`);
        }
        return this.consume();
    }

    // --- The Main Loop ---
    public parse(): Program {
        let program: Program = { type: "Program", body: [] };

        while (this.pos < this.tokens.length) {
            // This is where we will route the logic!
            // e.g., if (this.peek().text === "class") { program.body.push(this.parseClass()); }
            
            this.consume(); // (Temporary: just eat tokens to prevent infinite loops)
        }

        return program;
    }
}