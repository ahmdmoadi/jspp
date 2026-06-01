"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage_type_t = exports.keyword_control_t = exports.tokenTypes = exports.JSPPToken = void 0;
class JSPPToken {
    constructor(type, text, line, char) {
        this.type = type;
        this.text = text;
        this.line = line;
        this.char = char;
    }
}
exports.JSPPToken = JSPPToken;
// export type VSC_JSPPTokenType = "type" | "storage.type_t" | "keyword.control_t";
exports.tokenTypes = [
    'class', 'type', 'parameter',
    'variable', 'property', 'enumMember' /*constant*/,
    'function', 'method', 'macro', 'comment',
    'string', 'keyword', 'number', 'regexp',
    'operator', 'storage_type_t', 'keyword_operator_new_t',
    'string_regexp_t', "keyword_control_t",
    "punctuation_definition_string_t",
    'regex_flags_t'
];
exports.keyword_control_t = [
    "for", "if", "else", "loop",
    "return", "import", "export",
    "with", "forevery", "do",
    "break", "while", "async",
    "await", "continue",
];
exports.storage_type_t = [
    "const", "let", "int", "float", "char", "void", "class",
    "of", "in" // not really but like i dont give a fk about ts anyway, I just want it blue
];
//# sourceMappingURL=tokenizer.types.js.map