const pg = require('./superhosts');

const insert10k = () => {
    for (let i = 1; i < 10000; i++) {
        let dateStr = 'Feb ' + (Math.floor(Math.random() * 6) + 1) + ' 2018';
        pg.insertSuperHost(i, dateStr);
    }
}

setTimeout(insert10k, 500);