"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
// 2. --- The Parser Class ---
class Parser {
    tokens;
    pos = 0;
    constructor(tokens) {
        this.tokens = tokens;
    }
    // Helper: Look at the current token without moving forward
    peek() {
        return this.tokens[this.pos];
    }
    // Helper: Grab the token and move forward
    consume() {
        return this.tokens[this.pos++];
    }
    // Helper: Crash the compiler if the token isn't what we expect
    expect(type, text) {
        const token = this.peek();
        if (token.type !== type || (text && token.text !== text)) {
            throw new Error(`Syntax Error: Expected ${text || type} but found ${token.text}`);
        }
        return this.consume();
    }
    // --- The Main Loop ---
    parse() {
        let program = { type: "Program", body: [] };
        while (this.pos < this.tokens.length) {
            // This is where we will route the logic!
            // e.g., if (this.peek().text === "class") { program.body.push(this.parseClass()); }
            this.consume(); // (Temporary: just eat tokens to prevent infinite loops)
        }
        return program;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.g.js.map