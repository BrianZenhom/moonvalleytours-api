import Review from '../models/reviewModel.js'
import catchAsync from '../utils/catchAsync.js'

export const createReview = catchAsync(async (req, res, next) => {
  const newReview = new Review(req.body)

  const savedReview = await newReview.save()

  res.status(200).json({
    status: 'success',
    data: {
      savedReview,
    },
  })
})

export const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
  const reviewCount = await Review.countDocuments()

  res.status(200).json({
    status: 'success',
    count: reviewCount,
    data: { reviews },
  })
})
