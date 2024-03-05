import AppError from './../utils/appError.js'

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })

    // Programming or other unknown error: don't want to leak details
  } else {
    // 1) Log Error
    console.error('ERROR 🪳', err)

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }
}

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err)

    if (error.name === 'CastError') error = handleCastErrorDB(error)

    sendErrorProd(error, res)
  }
}
