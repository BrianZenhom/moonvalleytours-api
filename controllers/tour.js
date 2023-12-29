import Tour from '../models/Tour.js'
import City from '../models/City.js'
import { createError } from '../utils/error.js'

export const createTour = async (req, res, next) => {
  const cityId = req.params.cityid
  const newTour = new Tour(req.body)

  try {
    const savedTour = await newTour.save()
    try {
      await City.findByIdAndUpdate(cityId, { $push: { tours: savedTour._id } })
    } catch (err) {
      next(err)
    }
    res.status(200).json(savedTour)
  } catch (err) {
    next(createError(err, 'Something went wrong'))
  }
}
export const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json(tour)
  } catch (err) {
    next(err)
  }
}
export const updateTour = async (req, res, next) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedTour)
  } catch (err) {
    next(err)
  }
}
export const deleteTour = async (req, res, next) => {
  const cityId = req.params.cityid
  try {
    await Tour.findByIdAndDelete(req.params.id)
    try {
      await City.findByIdAndUpdate(cityId, {
        $pull: { tours: req.params.id },
      })
    } catch (err) {
      next(err)
    }
    res.status(200).json('Tour deleted!')
  } catch (err) {
    next(err)
  }
}
export const getAllTour = async (req, res, next) => {
  try {
    const { min, max, limit, cancellation, featured } = req.query
    const tours = await Tour.find({
      cancellation: cancellation || true,
      price: { $gte: min | 1, $lte: max || 999 },
    }).limit(limit)
    res.status(200).json(tours)
  } catch (err) {
    next(err)
  }
}

export const getToursInCity = async (req, res, next) => {
  try {
    const tours = await Tour.find({ city: req.params.city })
    res.status(200).json(tours)
  } catch (err) {
    next(err)
  }
}
