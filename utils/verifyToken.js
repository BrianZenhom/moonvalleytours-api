import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { createError } from './error.js'

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) {
    return next(createError(401, 'You are not authenticated!'))
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, 'Token isnt valid!'))
    req.user = user
    next()
  })
}

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      return next(createError(403, 'youre not authorized!'))
    }
  })
}

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      return next(createError(403, 'youre not authorized!'))
    }
  })
}

export const protect = async (req, res, next) => {
  let token
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]

      if (!token) {
        return next(createError(401, 'You are not authenticated!'))
      }

      // verify token still active
      const decoded = await promisify(jwt.verify)(token, process.env.JWT)

      next()
    }
  } catch (err) {
    console.log(err)
  }
}
