import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { createError } from './../utils/error.js'
import bcrypt from 'bcryptjs'

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
      return next(createError(400, 'Please provide email and password'))

    const user = await User.findOne({ email: req.body.email }).select(
      '+password'
    )
    if (!user) return next(createError(404, 'User not found!'))

    if (
      !user ||
      !(await user.correctPassword(req.body.password, user.password))
    )
      return next(createError(401, 'Invalid email or password!'))

    const token = signToken(user._id)

    const { isAdmin, ...otherDetails } = user._doc
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin })
  } catch (err) {
    next(err)
  }
}
