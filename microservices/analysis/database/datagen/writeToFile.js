var fs = require('fs');
var faker = require('faker');
var path = require('path');

var writeToStream = function(i, stream) {
    for (; i < 2000000; i++) {
        var bookId = String(Math.floor(Math.random() * 10000000000));
        var hostId = String(Math.floor(Math.random() * 10000));
        var date = faker.date.between('2011-01-01', '2017-12-31');
        date = JSON.stringify(date);
        date = date.split('T').join(' ');
        var line = bookId + ',' + hostId + ',' + date;
        if (!stream.write(line + '\n')) {
            stream.once('drain', function () {
                writeToStream(i + 1, stream);
            });
            return;
        }
    }
    console.log('finished file');lsls
    stream.end();
    return;
}

var wr = fs.createWriteStream(path.resolve(__dirname, '../datafiles/bigFile.txt'));
await writeToStream(0, wr, 0);