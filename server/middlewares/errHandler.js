const notFound = (req ,res, next) => {
    const error = new Error(`Route ${req.originalUrl} not Found`)
    res.status(404)
    next(error)
}

const errHandler = (error, req, res, next) => {
    const statusCode  = res.statusCode === 200 ? 500 : res.statusCode
    return res.status(statusCode).json({
        succes: false,
        mess: error?.message
    })
}

module.exports={
    notFound,
    errHandler
}