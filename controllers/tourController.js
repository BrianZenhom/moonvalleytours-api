import Tour from '../models/tourModel.js'
import City from '../models/cityModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory.js'

export const setCityCountryIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.city) req.body.city = req.params.cityId
  if (!req.body.country) req.body.country = req.params.countryId

  next()
}

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '7'
  req.query.sort = 'price,-ratingsAverage'
  req.query.fields =
    'city, country, title, price, priceDiscount, difficulty, ratingsAverage, cancellation, tourThumbnail'

  next()
}

export const createTour = catchAsync(async (req, res, next) => {
  const city = req.params.cityId
  const newTour = new Tour(req.body)

  const savedTour = await newTour.save()

  await City.findByIdAndUpdate(city, { $push: { tours: savedTour._id } })

  res.status(200).json({
    status: 'success',
    data: {
      savedTour,
    },
  })
})

export const getTour = getOne(Tour, { path: 'reviews' })
export const updateTour = updateOne(Tour)
export const deleteTour = deleteOne(Tour)
export const getAllTour = getAll(Tour)

export const getToursInCity = catchAsync(async (req, res, next) => {
  const tours = await Tour.find({ city: req.params.city })

  if (!tours) {
    return next(new AppError('No tours found with that city', 404))
  }

  res.status(200).json({ count: tours.length, tours })
})

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // grouping by difficulty or city or whatever value we want.
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      // sorting by price, ascending. It has to be with the property defined in the $group
      $sort: { avgPrice: 1 },
    },
    {
      // redefined the match with $ne which stands for not equal.
      $match: { _id: { $ne: 'EASY' } },
    },
  ])

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  })
})

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1

  const plan = await Tour.aggregate([])

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  })
})
