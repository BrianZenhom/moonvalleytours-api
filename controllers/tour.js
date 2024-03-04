import Tour from '../models/Tour.js'
import City from '../models/City.js'
import { createError } from '../utils/error.js'
import catchAsync from '../utils/catchAsync.js'

export const createTour = async (req, res, next) => {
  const city = req.params.city
  const newTour = new Tour(req.body)

  try {
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
  } catch (err) {
    next(createError(err, 'Something went wrong'))
  }
}

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)

  res.status(200).json(tour)
})

export const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  )
  res.status(200).json(updatedTour)
})

export const deleteTour = async (req, res, next) => {
  const city = req.params.city
  try {
    await Tour.findByIdAndDelete(req.params.id)
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
    res.status(200).json('Tour deleted!')
  } catch (err) {
    next(err)
  }
}

export const getAllTour = catchAsync(async (req, res, next) => {
  const regex = new RegExp(req.query.q, 'i')
  const page = req.query.page
  const ITEM_PER_PAGE = 5

  const count = await Tour.find({ title: { $regex: regex } }).count()
  const tours = await Tour.find({ title: { $regex: regex } })
    .limit(ITEM_PER_PAGE)
    .skip(ITEM_PER_PAGE * (page - 1))
    .lean()
  res.status(200).json({ count, tours })
})

export const getToursInCity = catchAsync(async (req, res, next) => {
  const tours = await Tour.find({ city: req.params.city })

  res.status(200).json(tours)
})
