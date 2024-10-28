exports.throwError = (req, res, next) => {
    const error = new Error("ERROR: This is a test!")
    error.status = 500
    throw error
}