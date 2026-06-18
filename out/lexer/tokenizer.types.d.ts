export type JSPPTokenType = "KEYWORD" | "NUMBER" | "IDENTIFIER" | "SYMBOL" | "STRING" | "COMMENT" | "REGEX";
export interface JSPPToken {
    type: JSPPTokenType;
    text: string;
    line: number;
    char: number;
}
export declare const tokenTypes: readonly ["class", "type", "parameter", "variable", "property", "enumMember", "function", "method", "macro", "comment", "string", "keyword", "number", "regexp", "operator", "storage_type_t", "keyword_operator_new_t", "string_regexp_t", "keyword_control_t", "punctuation_definition_string_t", "regex_flags_t"];
export type VSC_JSPPTokenType = typeof tokenTypes[number];
export interface VSC_JSPPToken {
    type: VSC_JSPPTokenType;
    text: string;
    line: number;
    char: number;
}
export declare const keywords: string[];
export declare const keyword_control_t: string[];
export declare const storage_type_t: string[];
export declare const multichar_ops: string[];
export declare const inferrers: string[];
