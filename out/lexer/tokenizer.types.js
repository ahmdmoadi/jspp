"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferrers = exports.multichar_ops = exports.storage_type_t = exports.keyword_control_t = exports.keywords = exports.tokenTypes = void 0;
// DEPRECATED
// export class JSPPToken {
//      constructor(type: JSPPTokenType, text: string, line: number, char: number) {
//           this.type = type;
//           this.text = text;
//           this.line = line;
//           this.char = char;
//      }
// }
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
exports.keywords = [
    "let", // dynamic/java "var" variable declaration. let
    "var",
    "const",
    "int", // 4byte / 32 bit integer
    "string",
    "unsigned",
    "function", // function functName(void?) {} same as void functName(void?) {}
    "void",
    "arguments",
    "instanceof",
    "delete",
    "alloc",
    "addressof",
    "pointer",
    "is",
    "in",
    "arguments",
    "static",
    "private",
    "new",
    "class",
    "return",
    "public",
    "async",
    "await",
    "lazy"
];
exports.keyword_control_t = [
    "for", "if", "else", "loop",
    "return", "import", "export",
    "with", "forevery", "do",
    "break", "while", "async",
    "await", "continue", "at",
];
exports.storage_type_t = [
    "const", "let", "int", "float", "char", "void", "class",
    "of", "in", // not really but like i dont give a fk about ts anyway, I just want it blue
    "lazy"
];
exports.multichar_ops = [
    "===", "!==", "<<=", ">>=", // 3-char first
    "==", "!=", ">=", "<=", "&&", "||", "++", "--",
    "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<", ">>"
];
exports.inferrers = [
    "let", "var", "const", /* const only if like: `const name = "whatever"` */
];
//# sourceMappingURL=tokenizer.types.js.map