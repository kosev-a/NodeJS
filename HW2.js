import EventEmitter from "events";

// 1. Решите задачу по выводу данных в консоль.

// console.log('Record 1');
// setTimeout(() => {
//     console.log('Record 2');
//     Promise.resolve().then(() => {
//         setTimeout(() => {
//             console.log('Record 3');
//             Promise.resolve().then(() => {
//                 console.log('Record 4');
//             });
//         });
//     });
// });
// console.log('Record 5');
// Promise.resolve().then(() => Promise.resolve().then(() => console.log('Record 6')));

//  Решение: первыми выполнятся команды в основном потоке - это 1 и 5
// затем разрешится промис, будет выведено 6
// затем выполнится команда таймера верхнего уровня, будет выведено 2
// разрешится промис и выполнится вложенный таймер, будет выведено 3
// разрешится промис внутри вложенного таймера, будет выведено 4

// 2. Напишите программу, которая будет принимать на вход несколько аргументов: дату и время в
// формате «час-день-месяц-год». Задача программы — создавать для каждого аргумента
// таймер с обратным отсчётом: посекундный вывод в терминал состояния таймеров (сколько
// осталось). По истечении какого-либо таймера, вместо сообщения о том, сколько осталось,
// требуется показать сообщение о завершении его работы. Важно, чтобы работа программы
// основывалась на событиях.

class TimerEmitter extends EventEmitter { };

const emitterObject = new TimerEmitter();

const inputDates = process.argv.slice(2);

class Handler {
    static setTimer(date) {

        const getTimeRemaining = (date) => {
            const t = Date.parse(date) - Date.now(),
                seconds = Math.floor((t / 1000) % 60),
                minutes = Math.floor((t / (1000 * 60)) % 60),
                hours = Math.floor((t / (1000 * 60 * 60)) % 24),
                days = Math.floor((t / (1000 * 60 * 60 * 24)));

            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        };

        const setClock = (date) => {
            const timeInterval = setInterval(updateClock, 1000);

            function updateClock() {
                const t = getTimeRemaining(date);

                if (isNaN(t.total)) {
                    emitterObject.emit('error');
                    emitterObject.removeListener('setTimer', Handler.setTimer);
                    clearInterval(timeInterval);
                } else if (t.total <= 0) {
                    emitterObject.emit('stopTimer');
                    emitterObject.removeListener('setTimer', Handler.setTimer);
                    clearInterval(timeInterval);
                } else {
                    console.log(`${t.days} days ${t.hours} hours ${t.minutes} minutes ${t.seconds} seconds left`);
                }
            }
        };

        setClock(date);

    } static stopTimer() {
        console.log('Time is up!');
    } static error() {
        console.log('Incorrect data');
    }
}

emitterObject.on('setTimer', Handler.setTimer);
emitterObject.on('stopTimer', Handler.stopTimer);
emitterObject.on('error', Handler.error);

const addZero = (num) => {
    if (num.length == 1) {
        return ("0" + num);
    } else {
        return num;
    }
};

inputDates.forEach(item => {
    let date = item.split('-');
    let arrDate = [];

    for (let i = 0; i <= date.length - 1; i++) {
        arrDate.push(addZero(date[i]));
    }

    date = arrDate.reverse().join('-');
    date = date.slice(0, -3) + 'T' + date.slice(-2) + ':00:00';

    emitterObject.emit('setTimer', date);
});




