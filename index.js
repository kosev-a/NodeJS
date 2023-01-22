#!/usr/bin/env node

import readline from 'readline';
import path from 'path';
import inquirer from "inquirer";
import fsp from 'fs/promises';
import { createReadStream } from 'fs';

let currentDirectory = process.cwd();
let numberLine = 1;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const readFile = (fileName, str) => {
    try {
        const rl = readline.createInterface({
            input: createReadStream(path.join(currentDirectory, fileName), 'utf-8'),
        });

        rl.on('line', (line) => {

            if (str && line.includes(str)) {
                console.log(`====found string \"${str}\" on line #${numberLine}:====== `);
            }
            console.log(line);
            numberLine += 1;
        });

    } catch (err) {
        console.error(err);
    } finally {
        rl.close();
    }
};

const showList = async (indir) => {
    const list = [];
    for (const item of indir) {
        list.push(item);
    }
    return list;
};

const chooseItem = (choices) => {
    return inquirer
        .prompt(
            {
                name: "fileName",
                type: 'list', // input, number, confirm, list, rawlist, expand, checkbox, password
                message: "Choose file or dir",
                choices
            })
};

const inputStr = () => {
    return inquirer
        .prompt(
            {
                name: "searchOption",
                type: 'input',
                message: "Enter the search string or press enter"
            })
};

const readDir = (inPath) => {

    fsp
        .readdir(path.join(currentDirectory, inPath), 'utf-8')
        .then((indir) => showList(indir))
        .then((choices) => chooseItem(choices))
        .then(async (answer) => {

            const src = await fsp.stat(path.join(currentDirectory, answer.fileName));

            if (src.isFile()) {
                inputStr().then((data) => {
                    let str;
                    data.searchOption ? str = data.searchOption : str = null;
                    readFile(answer.fileName, str);
                });

            } else {
                readDir(path.join(answer.fileName), 'utf-8');
                currentDirectory += '\\' + answer.fileName;
            }
        })
}

rl.question('Please enter the path to the file or press enter: ', (inPath) => {
    readDir(inPath)
});