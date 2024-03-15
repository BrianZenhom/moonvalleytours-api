import Tour from '../models/tourModel.js'
import City from '../models/cityModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

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

export const getAllTour = catchAsync(async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query }

  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach(el => delete queryObj[el])

  const query = Tour.find(queryObj)

  // const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

  // Execute query
  const tours = await query

  res.status(200).json({
    status: 'success',
    count: tours.length,
    data: {
      tours,
    },
  })
})

export const getToursInCity = catchAsync(async (req, res, next) => {
  const tours = await Tour.find({ city: req.params.city })

  if (!tours) {
    return next(new AppError('No tours found with that city', 404))
  }

  res.status(200).json(tours)
})
