import User from '../models/User.js'
import { createError } from './../utils/error.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

    await newUser.save()

    res.status(201).send('User has been created.')
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password)
      return next(createError(400, 'Please provide email and password'))

    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(createError(404, 'User not found!'))

    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (!passwordCorrect)
      return next(createError(400, 'Invalid email or password!'))

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    )

    const { password, isAdmin, ...otherDetails } = user._doc
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin })
  } catch (err) {
    next(err)
  }
}
