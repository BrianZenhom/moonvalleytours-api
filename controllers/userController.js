import Users from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import { deleteOne, updateOne } from './handlerFactory.js'

export const getUser = async (req, res, next) => {
  try {
    const user = await Users.findById({ id: req.params.id })
    res.status(200).json(user)
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

// Do not update passwords with this!
export const updateUser = updateOne(Users)

export const deleteUser = deleteOne(Users)
