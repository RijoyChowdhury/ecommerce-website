const isObjectEmpty = (payload) => {
    return Object.keys(payload).length === 0;
}

module.exports = {
    isObjectEmpty
}