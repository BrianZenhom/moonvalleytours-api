import Tour from '../models/tourModel'
import catchAsync from '../utils/catchAsync'

export const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find()

  res.status(200).render('overview', {
    title: 'All tours',
    tours
  })
})

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  })

  res.status(200).render('tour', {
    tour
  })
})

export const getLoginForm = (req, res) => {

}
