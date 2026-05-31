import { tokenize } from "../lexer/tokenizer";

let str = "int a = 1;";
let currentPath = ["root"];
let ast_tree = {
     "type": "root",
     "body": [

     ]
}

function howdidwegethere(str: string) {
     let token = tokenize(str);
     // check keyword then do this hit
}