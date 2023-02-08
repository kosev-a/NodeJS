import http from "http";
import { Server } from 'socket.io';
import fs from "fs";
import path from "path";

const host = "localhost";
const port = 3000;
let rc;
let userCookie = {};
let userId = 0;
let userName = '';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }

  rc = req.headers.cookie;

  if (!rc) {
    userId += 1;
    userName = `userName_${userId}`;
    res.setHeader('Content-Type', 'text/html')
    res.writeHead(200, {
      "Set-Cookie": `userId=${userName}`
    });

    userCookie["userId"] = userName;
  }

  const parseCookies = () => {
    rc = req.headers.cookie;
    if (rc) {
      rc && rc.split(';').forEach(function (cookie) {
        let parts = cookie.split('=');
        userCookie[parts.shift().trim()] = decodeURI(parts.join('='));
      });
    };
    console.log(userCookie);
    return userCookie;
  };

  const io = new Server(server);

  io.on('connection', (client) => {
    parseCookies();
    console.log(`Websocket connetcted ${client.id}`);
    client.broadcast.emit('new-conn-event', { msg: `The new client ${userCookie["userId"]} connected` });

    client.on('disconnect', () => {
      parseCookies();
      console.log(`Websocket disconnetcted ${client.id}`);
      client.broadcast.emit('disconn-event', { msg: `Client ${userCookie["userId"]} disconnected` });
    });

    client.on('client-msg', (data) => {
      client.broadcast.emit('server-msg', { msg: data.msg, author: data.author });
      client.emit('server-msg', { msg: data.msg, author: data.author });
    });
  });
});

server.listen(port, host, () =>
  console.log(`Server running at http://${host}:${port}`)
);