import Users from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import { deleteOne } from './handlerFactory.js'

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

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find()
  // .select('+isAdmin')

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  })
})

export const deleteUser = deleteOne(Users)
