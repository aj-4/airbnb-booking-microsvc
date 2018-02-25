const initBook = require('./iCassandraBooking');
const getBook = require('./bookRetrieval');
const addBook = require('./bookInsertion');
const getBookByDate = require('./bookByDateRetrieval');

const initView = require('./iCassandraView');
const addView = require('./viewInsertion');
const getView = require('./viewRetrieval');
const getViewByDate = require('./viewByDateRetrieval');

module.exports = {
    initBook,
    initView,
    getBook,
    getView,
    addBook,
    addView,
    getBookByDate,
    getViewByDate
}