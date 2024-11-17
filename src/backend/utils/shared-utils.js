const isObjectEmpty = (payload) => {
    return Object.keys(payload).length === 0;
}

const otpGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

module.exports = {
    isObjectEmpty,
    otpGenerator
}