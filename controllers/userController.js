import Users from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import { deleteOne, getOne, updateOne } from './handlerFactory.js'

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

export const getUser = getOne(Users)

// Do not update passwords with this!
export const updateUser = updateOne(Users)

export const deleteUser = deleteOne(Users)
