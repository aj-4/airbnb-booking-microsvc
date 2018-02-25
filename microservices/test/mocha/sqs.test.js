process.env.NODE_ENV = 'test';

const listQueues = require('../../server/sqs/view_queue/sqs_listqueues');
const expect = require('chai').expect;
const helpers = require('./mochaHelpers');

//server testing
const db = require('../../database/index');

const sendViewMsg = require('../../server/sqs/view_queue/sqs_sendmessage');
const receiveViewMsg = require('../../server/sqs/view_queue/sqs_receivemessage');

const sendBookMsg = require('../../server/sqs/book_queue/sqs_sendmessage');
const receiveBookMsg = require('../../server/sqs/book_queue/sqs_receivemessage');

describe('SQS', () => {

    const inserted = [];
    const today = Date().slice(4, 15);

    describe('Queue Configuration', () => {
        it('two event queues should exist (booking and view)', async () => {
            // let queueList = await listQueues();
            listQueues().then(res => {
                let names = res.map(queueUrl => queueUrl.slice(queueUrl.lastIndexOf('/') + 1));
                expect(names[0]).to.equal('bookingQ');
                expect(names[1]).to.equal('viewQ');
            })
        })
    });

    describe('Queue Interaction', () => {

        it('should send a new message to the view queue', async () => {
            let msg = helpers.generateDbEntry();
            let prom = await sendViewMsg(msg.listingId, msg.hostId, bool => {
                expect(bool).to.be.true;
            });
        })
        it('should send a new message to the booking queue', async () => {
            let msg = helpers.generateDbEntry();
            let prom = await sendBookMsg(msg.listingId, msg.hostId, bool => {
                expect(bool).to.be.true;
            });
        })
        it('should receive ten view messages at once', async () => {
            for (let i = 0; i < 10; i++) {
                let msg = helpers.generateDbEntry();
                sendViewMsg(msg.listingId, msg.hostId);
                inserted.push(msg);
            }
            await receiveViewMsg.receiveMessage(num => {
                console.log('num is', num);
                expect(num).to.be(10);
            })
        })
        it('should receive ten book messages at once', async () => {
            for (let i = 0; i < 10; i++) {
                let msg = helpers.generateDbEntry();
                sendViewMsg(msg.listingId, msg.hostId);
                inserted.push(msg);
            }
            await receiveBookMsg.receiveMessage(num => {
                console.log('num is', num);
                expect(num).to.be(10);
            })
        })
    })

    describe('Queue Workers', () => {
        it('view message worker function should exist', () => {
            expect(receiveViewMsg.receiveMessageLoop).to.be.a('function');
        })
        it('book message worker function should exist', () => {
            expect(receiveBookMsg.receiveMessageLoop).to.be.a('function');
        })
    })

    describe('Database Interaction', () => {
        it('should have inserted all view messages to the db', async () => {
            let results = [];
            let promises = [];
            inserted.forEach((msg, i) => {
                promises.push(db.getView(inserted[i].hostId, today).then(result => results.push(result)));
            })
            await Promise.all(promises);
        })
        it('should have inserted all booking messages to the db', async () => {
            let results = [];
            let promises = [];
            inserted.forEach((msg, i) => {
                promises.push(db.getBook(inserted[i].hostId, today).then(result => results.push(result)));
            })
            await Promise.all(promises);
        })
    })
});