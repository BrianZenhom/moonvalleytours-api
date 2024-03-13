import crypto from 'node:crypto'
import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import catchAsync from './../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import sendEmail from '../utils/email.js'

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

export const register = async (req, res, next) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      name: req.body.name,
      surname: req.body.surname,
      phone: req.body.phone,
      nationality: req.body.nationality,
    })

    const token = signToken(newUser._id)

    await newUser.save()

    res.status(201).send({
      status: 'User has been created.',
      token,
      data: { user: newUser },
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password)
      return next(new AppError('Please provide email and password', 400))

    const user = await User.findOne({ email: req.body.email }).select(
      '+password'
    )
    if (!user) return next(new AppError('User not found!', 404))

    if (
      !user ||
      !(await user.correctPassword(req.body.password, user.password))
    )
      return next(new AppError('Invalid email or password!', 401))

    const token = signToken(user._id)

    const { isAdmin, ...otherDetails } = user._doc
    res.status(200).json({
      status: 'success',
      token,
    })
  } catch (err) {
    next(err)
  }
}

export const protect = catchAsync(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    )
  }

  // 2 verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT)

  // 3 check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser)
    return next(
      new AppError('User belonging to this token no longer exists.', 401)
    )

  // 4 check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    )
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
})

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
      message,
    })

    res.status(200).json({
      status: 'success',
      message: 'New password was sent to your email',
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save({ validateBeforeSave: false })

    return next(
      new AppError(`We've ran into an issue, please try again later.`),
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
    passwordResetExpires: { $gt: Date.now() },
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
  const token = signToken(user._id)

  const { isAdmin, ...otherDetails } = user._doc
  res.status(200).json({
    status: 'success',
    token,
  })
})
