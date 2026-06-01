import { tokenize } from '../lexer/tokenizer';
// import chalk from 'chalk';

let input = `/regexp/igmsuy

let a = new String("idk");

class Person {
     private int hijriDiff = 1;
     public int age = 0;
     public string name = "";
}`;

console.log(`Input: "${input}\nOutput:\ns`,tokenize(input));