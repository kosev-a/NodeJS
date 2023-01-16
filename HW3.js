// По ссылке вы найдёте файл с логами запросов к серверу весом более 2 Гб. Напишите программу,
// которая находит в этом файле все записи с ip-адресами 89.123.1.41 и 34.48.240.111, а также
// сохраняет их в отдельные файлы с названием %ip-адрес%_requests.log.

import { once } from 'events';
import { createReadStream, createWriteStream } from 'fs';
import { createInterface } from 'readline';

(async function processLineByLine() {
    try {
        const rl = createInterface({
            input: createReadStream('./access_tmp.log'),
        });

        const ip1 = '89.123.1.41';
        const ip2 = '34.48.240.111';

        const writeStr = (line, ip) => {
            if (line.includes(ip)) {
                const writeStream = createWriteStream(`${ip}_requests.log`, { flags: 'a' });
                writeStream.write(`\r\n${line}`);
            }
        }

        rl.on('line', (line) => {
            writeStr(line, ip1);
            writeStr(line, ip2);
        });

        await once(rl, 'close');

        console.log('File processed.');
    } catch (err) {
        console.error(err);
    }
})();