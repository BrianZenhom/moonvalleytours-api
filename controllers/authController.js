import crypto from 'crypto'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import catchAsync from './../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import sendEmail from '../utils/email.js'

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  // Remove password from output
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    data: { user }
  })
}

export const register = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body)

  createSendToken(newUser, 201, res)
})

export const updatePassword = catchAsync(async (req, res, next) => {
  // Get user from db
  const user = await User.findById(req.user.id).select('+password')

  // Check if password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401))
  }

  // If its correct, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm

  await user.save()
  // Log user in, send JWT
  createSendToken(user, 200, res)
})

export const login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password) { return next(new AppError('Please provide email and password', 400)) }

  const user = await User.findOne({ email: req.body.email }).select('+password')
  if (!user) return next(new AppError('Email not found!', 404))

  if (!user || !(await user.correctPassword(req.body.password, user.password))) { return next(new AppError('Invalid email or password!', 401)) }

  createSendToken(user, 200, res)
})

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.status(200).json({ status: 'success' })
}

export const protect = catchAsync(async (req, res, next) => {
  let token

  // 1. Assign Token to authorization headers, if not assign it to cookies.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    )
  }

  // 2. verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT)

  // 3. check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(
      new AppError('User belonging to this token no longer exists.', 401)
    )
  }

  // 4. check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    )
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
})

export const isLoggedIn = async (req, res, next) => {
  // 1. Verify Token
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT
      )

      // 2. Check if user still exists
      const currentUser = await User.findById(decoded.id)
      if (!currentUser) {
        return next()
      }

      // 3. Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next()
      }

      //  4. There is a loggin user, asign it to res.locals
      res.locals.user = currentUser
      return next()
    } catch (err) {
      return next()
    }
  }
  next()
}

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Roles ['admin', 'lead-guide'] role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403))
    }

    next()
  }
}

export const forgotPassword = catchAsync(async (req, res, next) => {
  // first, get user through posted email
  const user = await User.findOne({ email: req.body.email })

  if (!user) return next(new AppError('No user found', 404))

  // generate random token
  const resetToken = user.createPasswordResetToken()

  await user.save({ validateBeforeSave: false })

  // send it back as an email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`

  const message = `Forgot your password? Create a new password here: ${resetURL}\nIf you didn't request a new password, please ignore this email.`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Forgot password reset (valid for 10 min)',
      message
    })

    res.status(200).json({
      status: 'success',
      message: 'New password was sent to your email'
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save({ validateBeforeSave: false })

    return next(
      new AppError('We\'ve ran into an issue, please try again later.'),
      500
    )
  }
})

export const resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  // If token has not expired, and theres a user, set the new password
  if (!user) return next(new AppError('Url is invalid or has expired', 400))

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm

  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()

  // Update changedPasswordAt property for the user

  // Log the user in, send a JWT
  createSendToken(user, 200, res)
})
