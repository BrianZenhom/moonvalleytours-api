import Tour from '../models/tourModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

export const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find()

  res.status(200).render('overview', {
    title: 'Dashboard',
    tours
  })
})

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  })

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404))
  }

  res.status(200).render('tour', {
    tour
  })
})

export const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  })
}

export const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
}

export const updateUserData = (req, res, next) => {
  console.log('Update user', req.body)
}
