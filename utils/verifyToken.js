import jwt from 'jsonwebtoken'
import AppError from '../utils/appError.js'

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) {
    return next(new AppError('You are not authenticated!', 401))
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(new AppError('Token isnt valid!', 403))
    req.user = user

    next()
  })
}

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      return next(new AppError(`You are not authorized!`, 403))
    }
  })
}

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      return next(new AppError(`You are not authorized!`, 403))
    }
  })
}
