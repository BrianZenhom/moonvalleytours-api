import Tour from '../models/tourModel.js'
import City from '../models/cityModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '7'
  req.query.sort = 'price,-ratingsAverage'
  req.query.fields =
    'city, country, title, price, priceDiscount, difficulty, ratingsAverage, cancellation, tourThumbnail'
  next()
}

export const createTour = catchAsync(async (req, res, next) => {
  const city = req.params.city
  const newTour = new Tour(req.body)

  const savedTour = await newTour.save()

  try {
    await City.findOneAndUpdate(
      { city: city },
      { $push: { tours: savedTour._id } }
    )
  } catch (err) {
    next(err)
  }
  res.status(200).json(savedTour)
})

export const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  )

  if (!updatedTour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json(updatedTour)
})

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json(tour)
})

export const deleteTour = catchAsync(async (req, res, next) => {
  const city = req.params.city

  const tour = await Tour.findByIdAndDelete(req.params.id)

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  try {
    await City.findOneAndUpdate(
      { city: city },
      {
        $pull: { tours: req.params.id },
      }
    )
  } catch (err) {
    next(err)
  }
  res.status(204).json('Tour deleted!')
})

class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const queryObj = { ...this.queryString }

    // Filtering

    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    this.query.find(JSON.parse(queryStr))
  }
}

export const getAllTour = catchAsync(async (req, res, next) => {
  // Build query
  // const queryObj = { ...req.query }

  // // Filtering

  // const excludedFields = ['page', 'sort', 'limit', 'fields']
  // excludedFields.forEach(el => delete queryObj[el])

  // // Advanced filtering
  // let queryStr = JSON.stringify(queryObj)
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

  // let query = Tour.find(JSON.parse(queryStr))

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Field Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    query = query.select(fields)
  } else {
    query = query.select('-__v')
  }

  // Pagination
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 100
  const skip = (page - 1) * limit

  query = query.skip(skip).limit(limit)

  if (req.query.page) {
    const numTours = await Tour.countDocuments()
    if (skip >= numTours) throw new AppError('This page does not exist', 404)
  }

  // Execute query
  const features = new APIFeatures(Tour.find(), req.query).filter()

  const tours = await features.query

  res.status(200).json({
    status: 'success',
    count: tours.length,
    data: {
      tours,
    },
  })
})

export const getToursInCity = catchAsync(async (req, res, next) => {
  const count = await Tour.find({ city: req.params.city }).count()

  const tours = await Tour.find({ city: req.params.city })

  if (!tours) {
    return next(new AppError('No tours found with that city', 404))
  }

  res.status(200).json({ count, tours })
})
