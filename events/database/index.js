const init = require('./indexCassandra');
const getBook = require('./bookRetrieval');
const getView = require('./viewRetrieval');
const addBook = require('./bookInsertion');
const addView = require('./viewInsertion');
const getBookByDate = require('./bookByDateRetrieval');
const getViewByDate = require('./viewByDateRetrieval');

module.exports = {
    init,
    getBook,
    getView,
    addBook,
    addView,
    getBookByDate,
    getViewByDate
}