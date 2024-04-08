import Review from '../models/reviewModel.js'
import catchAsync from '../utils/catchAsync.js'

export const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
  const reviewCount = await Review.countDocuments()

  res.status(200).json({
    status: 'success',
    count: reviewCount,
    data: { reviews },
  })
})

export const createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user.id

  const newReview = await Review.create(req.body)

  res.status(200).json({
    status: 'success',
    data: {
      newReview,
    },
  })
})
