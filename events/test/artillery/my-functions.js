'use strict';

module.exports = {
    generateData
};

// Make sure to "npm install faker" first.
// const Faker = require('faker');

function generateData(userContext, events, done) {
    // generate data
    var listingId = String(Math.floor(Math.random() * 1000000));
    var hostId = String(Math.floor(Math.random() * 100000));;
    
    // add variables to virtual user's context:
    userContext.vars.listingId = listingId;
    userContext.vars.hostId = hostId;

    // continue with executing the scenario:
    return done();
}