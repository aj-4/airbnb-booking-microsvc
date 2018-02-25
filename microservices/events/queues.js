const receiveBook = require('./book_queue/sqs_receivemessage')
const sendBook = require('./book_queue/sqs_sendmessage')
const receiveView = require('./view_queue/sqs_receivemessage')
const sendView = require('./view_queue/sqs_sendmessage')

module.exports = {
    book: {
        receive: receiveBook,
        send: sendBook
    },
    view: {
        receive: receiveView,
        send: sendView
    }
}