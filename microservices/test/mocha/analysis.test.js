process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const analyze = require('../../analysis/analyzer');
const insertBook = require('../../database/bookInsertion');
const insertView = require('../../database/viewInsertion');

describe('Analysis Architecture', () => {
    const today = Date().slice(4, 15);
    const hostId = String(Math.floor(Math.random() * 1000));
    const listingId = String(Math.floor(Math.random() * 1000));    

    before(function() {
        let bookings = [];
        for (let i = 0; i < 2; i++) {
            bookings.push(insertBook(hostId, listingId));
        }
        let views = [];
        for (let i = 0; i < 5; i++) {
            views.push(insertView(hostId, listingId));
        }
        return Promise.all([...bookings, ...views]);
    });

    describe('Host Analysis', () => {
        it('should analyze a host for a given day', async () => {
            let hostData = await analyze.crDates(today, today, hostId);
            expect(hostData).to.be.an('array');
            expect(hostData[0].date).to.equal(today);
            expect(hostData[0].views).to.be.greaterThan(3);
        })
        it('should fail for an invalid host', async () => {
            try {
                let hostData = await analyze.crDates(today, today, '000000');                
            } catch(err) {
                expect(err).to.be.an('error');
            }
        })
    });

    describe('Day Analysis', () => {
        it('should return a conversion analysis for a given day', async () => {
            let dayData = await analyze.crDates(today, today);
            expect(dayData).to.be.an('array');
            expect(dayData[0].date).to.equal(today);
            expect(dayData[0].views).to.be.greaterThan(4);
        })
        it('should fail for an invalid day', async() => {
            try {
                let hostData = await analyze.crDates('Abc 12 2018', 'Abc 12 2018', hostId);
            } catch (err) {
                expect(err).to.be.an('error');
            }
        })
    })

});