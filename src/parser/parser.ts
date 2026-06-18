import { tokenize } from "../lexer/tokenizer";

let str = "int a = 1;";
let currentPath = ["root"];
let ast_tree = {
     "type": "root",
     "body": [

     ]
}; // ignore ast for now, I want to tinker around 1st then make classes and stuff.

let base_types = ["int", "char", "float", "float", "double", "void"];

parse(str);

function parse(str: string) {
     let tokens = tokenize(str);
     
     for (let i=0; i<tokens.length; i++) {
          let current = tokens[i];

          function peek(distance: number = 1) { return tokens[i+distance]; }
          function consume() { return tokens[++i]; }

          // int name() {}
          if(
               base_types.includes(current.text) &&
               peek(1).type === "IDENTIFIER" &&
               (peek(2).type === "SYMBOL" && peek(2).text === "(")
          ) {
               i += parse_function(tokens, i);
          }
     }
}

function parse_function(tokens: any[], i: number) {
     return 0;
}