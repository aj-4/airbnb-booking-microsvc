'use strict';

module.exports = {
    generateData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateData(userContext, events, done) {
    // generate data with Faker:
    var bookId = String(Math.floor(Math.random() * 10000000000));
    var hostId = String(Math.floor(Math.random() * 10000));;
    // add variables to virtual user's context:
    userContext.vars.bookId = bookId;
    userContext.vars.hostId = hostId;
    // continue with executing the scenario:
    return done();
}