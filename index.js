import colors from "colors";

const [start, end] = process.argv.slice(2);

const showSimpleNumbers = (start, end) => {
    start = parseInt(start);
    end = parseInt(end);
    let colorIndex = 0;
    const colorsArr = [colors.green, colors.yellow, colors.red];
    const colorsArrLength = colorsArr.length;
    let noDiditsInDiapason = true;

    if (!isFinite(start) || !isFinite(end)) {
        return console.log(colors.red("Incorrect numbers"));
    }

    if (start >= end) {
        return console.log(colors.red("No digits in diapason"));
    }

    if (start < 2) {
        start = 2;
    }

    nextPrime:
    for (let i = start; i <= end; i++) {
        let limit = parseInt(Math.sqrt(i));
        for (let j = 2; j <= limit; j++) {
            if (i % j == 0) continue nextPrime;
        }
        noDiditsInDiapason = false;
        console.log(colorsArr[colorIndex](i));
        colorIndex++;
        if (colorIndex > colorsArrLength - 1) {
            colorIndex = 0;
        }
    }

    if (noDiditsInDiapason) {
        return console.log(colors.red("No digits in diapason"));
    }
};

showSimpleNumbers(start, end);