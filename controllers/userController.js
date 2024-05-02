import Users from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import { deleteOne, getOne, updateOne } from './handlerFactory.js'

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

export const updateMe = catchAsync(async (req, res, next) => {
  // Create an error if an user tries to update password.
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('Wrong route, use update my password', 400))

  // filtered unwanted fields
  const filteredBody = filterObj(
    req.body,
    'name',
    'surname',
    'email',
    'nationality'
  )

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  })
})

export const deleteMe = catchAsync(async (req, res, next) => {
  // find the user to delete
  await Users.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

export const updatePassword = catchAsync(async (req, res, next) => {
  // Get user from db
  const user = await Users.findById(req.user.id).select('+password')

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
