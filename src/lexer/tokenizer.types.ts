export type JSPPTokenType = "KEYWORD" | "NUMBER" | "IDENTIFIER" | "SYMBOL" | "STRING" | "COMMENT" | "REGEX" | "EOF";

export interface JSPPToken {
     type: JSPPTokenType;
     text: string;
     line: number;
     char: number;
}

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

export const tokenTypes = [
     'class', 'type', 'parameter',
      'variable', 'property', 'enumMember'/*constant*/,
     'function', 'method', 'macro', 'comment',
     'string', 'keyword', 'number', 'regexp',
      'operator', 'storage_type_t', 'keyword_operator_new_t',
     'string_regexp_t', "keyword_control_t",
     "punctuation_definition_string_t",
     'regex_flags_t'] as const;

export type VSC_JSPPTokenType = typeof tokenTypes[number];

export interface VSC_JSPPToken {
     type: VSC_JSPPTokenType,
     text: string,
     line: number,
     char: number
}

export const keywords = [
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
     "lazy",
     "defer",
     "typedef",
     "type"
];

export const keyword_control_t = [
     "for", "if", "else", "loop",
     "return", "import", "export",
     "with", "forevery", "do",
     "break", "while", "async",
     "await", "continue", "at",
     "defer"
];

export const storage_type_t = [
     "const", "let", "int", "float", "char", "void", "class",
     "of", "in", // not really but like i dont give a fk about ts anyway, I just want it blue
     "lazy"
];

export const multichar_ops = [
    "===","!==","<<=",">>=","<<<",">>>",   // 3-char first
    "==","!=",">=","<=","&&","||","++","--","**",
    "+=","-=","*=","/=","%=","&=","|=","^=","<<",">>"
];

export const inferrers = [
     "let", "var", "const", /* const only if like: `const name = "whatever"` */
];