import Users from '../models/userModel.js'
import AppError from '../utils/appError.js'
import catchAsync from '../utils/catchAsync.js'
import multer from 'multer'
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory.js'

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users')
  },
  filename: (req, file, cb) => {
    // user-:id-:currtimestamp.jpg
    const ext = file.mimetype.split('/')[1]
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  }

})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! please choose correct file type.', 400), false)
  }
}

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

export const uploadUserPhoto = upload.single('photo')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

export const getMe = (req, res, next) => {
  req.params.id = req.user.id

  next()
}

export const updateMe = catchAsync(async (req, res, next) => {
  // Create an error if an user tries to update password.
  if (req.body.password || req.body.passwordConfirm) { return next(new AppError('Wrong route, use update my password', 400)) }

  // filtered unwanted fields
  const filteredBody = filterObj(
    req.body,
    'name',
    'surname',
    'email',
    'country',
    'city',
    'instagram'
  )
  if (req.file) filteredBody.photo = req.file.filename

  // Update user document
  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    user: updatedUser
  })
})

export const deleteMe = catchAsync(async (req, res, next) => {
  // find the user to delete
  await Users.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null
  })
})

export const createUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not defined! Please use /register instead'
  })
}

export const getUser = getOne(Users)
export const getAllUsers = getAll(Users)
export const updateUser = updateOne(Users)
export const deleteUser = deleteOne(Users)
