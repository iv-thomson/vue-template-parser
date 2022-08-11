#!/usr/bin/env node

import program from 'commander'

import { readFile, writeFile } from 'fs/promises'
import { Parser } from '.'
 
program
  .version('0.1.0')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv)


  readFile('./files/index.vue').then((res) => {
    const parser = new Parser();
    const ast = parser.parse(res.toString());
    writeFile('./files/index.json', JSON.stringify(ast, null, 2))
    // console.log(JSON.stringify(ast, null, 2));
  })
