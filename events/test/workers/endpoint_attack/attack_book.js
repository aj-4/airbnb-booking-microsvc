const axios = require('axios');
const faker = require('faker');

var i = 0;

var attackLoop = function() {
    axios.post('http://localhost:3000/booking', {
        bookId: String(Math.floor(Math.random() * 10000000000)),
        hostId: String(Math.floor(Math.random() * 10000)),
        time: JSON.stringify(function () {
            var date = faker.date.between('2011-01-01', '2017-12-31');
            date = JSON.stringify(date);
            date = date.split('T').join(' ');
            return JSON.parse(date);
        }())
    })
        .then(function (response) {
            console.log('inserted booking' + i);
            i++;
            if ( i < 2000000) {
                attackLoop();                
            }            
        })
        .catch(function (error) {
            console.log(error);
        });
};

attackLoop();