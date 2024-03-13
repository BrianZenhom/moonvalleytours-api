import Users from '../models/userModel.js'
import AppError from '../utils/appError.js'

export const getUser = async (req, res, next) => {
  try {
    const user = await Users.findById({ id: req.params.id })
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await Users.findByIdAndDelete(req.params.id)
    res.status(200).json('User deleted!')
  } catch (err) {
    next(err)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find()
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
}
