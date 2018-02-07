const init = require('./indexCassandra');
const getBook = require('./bookRetrieval');
const getView = require('./viewRetrieval');
const addBook = require('./bookInsertion');
const addView = require('./viewInsertion');

module.exports = {
    init,
    getBook,
    getView,
    addBook,
    addView
}