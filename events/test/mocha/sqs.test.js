process.env.NODE_ENV = 'test';

const listQueues = require('../../server/sqs/view_queue/sqs_listqueues');
const expect = require('chai').expect;
const helpers = require('./mochaHelpers');

//server testing
const db = require('../../database/index');

const sendMsg = require('../../server/sqs/view_queue/sqs_sendmessage');
const receiveMsg = require('../../server/sqs/view_queue/sqs_receivemessage');

//hide logs

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

        it('should send a new message to the queue', async () => {
            let msg = helpers.generateDbEntry();
            let prom = await sendMsg(msg.listingId, msg.hostId, bool => {
                expect(bool).to.be.true;
            });
        })
        it('should receive a batch of ten messages at once', async () => {
            for (let i = 0; i < 10; i++) {
                let msg = helpers.generateDbEntry();
                sendMsg(msg.listingId, msg.hostId);
                inserted.push(msg);
            }
            await receiveMsg.receiveMessage(num => {
                console.log('num is', num);
                expect(num).to.be(10);
            })
        })
    })

    describe('Database Interaction', () => {
        it('should have inserted all messages to the db', async () => {
            let results = [];
            let promises = [];
            inserted.forEach((msg, i) => {
                promises.push(db.getView(inserted[i].hostId, today).then(result => results.push(result)));
            })
            await Promise.all(promises);
        })
    })
});