const generateDbEntry = () => {
    return {
        listingId: String(Math.floor(Math.random() * 1000)),
        hostId: String(Math.floor(Math.random() * 1000))
    }
}

module.exports = {
    generateDbEntry,
}