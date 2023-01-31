import path from 'path';
import fsp from 'fs/promises';
import fs from 'fs';
import http from 'http';
import url from 'url';
import { findRoute } from './routing.js'


const host = 'localhost';
const port = 3000;
let currentDirectory = process.cwd();
let res;
let req;
let list;

const routes = {
    "/": () => readDir(res),
    "/:file": () => checkFile(res, req.url),
}

const readFile = (fileName) => {
    try {
        const readStream = fs.createReadStream(fileName, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        readStream.pipe(res);

    } catch (err) {
        console.error(err);
    }
};

const readDir = (response) => {
    fsp
        .readdir(path.join(currentDirectory), 'utf-8')
        .then((indir) => {
            list = '';
            for (const item of indir) {
                list += `<li><a href="${item}">${item}</a></li>`;
            }
            return list;
        })
        .then((list) => {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(list);
        })
}

const checkFile = async (response, fileName) => {
    const src = await fsp.stat(path.join(currentDirectory, fileName));

    if (src.isFile()) {
        readFile(path.join(currentDirectory, fileName));
    } else {
        currentDirectory += '\\' + fileName;
        readDir(response);
    }
}

const server = http.createServer((request, response) => {
    res = response;
    req = request;
    let result = '';

    if (request.url === '/favicon.ico') {
        response.writeHead(200, { 'Content-Type': 'image/x-icon' });
        response.end();
        return;
    }

    if (request.method === 'GET') {
        const queryParams = url.parse(request.url, true);

        const routeParams = findRoute(request.url.split('?')[0], routes);
        const [routeCallback, params] = routeParams;

        if (typeof routeCallback === 'function') {
            result = routeCallback(params);
        }
        if (routeCallback === null) {
            response.statusCode = 404;
            result = { error: 'Not found' };
        }
        result = JSON.stringify(result);

    } else if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);
            response.writeHead(200, { 'Content-Type': 'json' });
            response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});

server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`));