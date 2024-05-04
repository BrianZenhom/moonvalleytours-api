import City from '../models/cityModel.js'
import Country from '../models/countryModel.js'
import tourModel from '../models/tourModel.js'
import catchAsync from '../utils/catchAsync.js'
import { getOne, updateOne } from './handlerFactory.js'

export const getCity = getOne(City, {
  path: 'tours',
  select:
    'title price priceDiscount desc duration ratingsAverage tourThumbnail cancellation',
})

export const updateCity = updateOne(City)

export const deleteCity = catchAsync(async (req, res, next) => {
  await City.findByIdAndDelete(req.params.cityId)

  await Country.findByIdAndUpdate(req.params.countryId, {
    $pull: { cities: req.params.cityId },
  })

  res.status(200).json('City deleted!')
})

export const getAllCities = async (req, res, next) => {
  const regex = new RegExp(req.query.q, 'i')
  const page = req.query.page
  const ITEM_PER_PAGE = 5
  // Create the featured query and fetch featured if it is true
  const featured = req.query.featured

  let query = featured
    ? { city: { $regex: regex }, featured: featured }
    : { city: { $regex: regex } }

  try {
    const count = await City.find({ city: { $regex: regex } }).countDocuments()
    const cities = await City.find(query)
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))
      .lean()

    res.status(200).json({ count, cities })
  } catch (err) {
    next(err)
  }
}

export const getCitiesInCountry = catchAsync(async (req, res, next) => {
  let filter = {}
  if (req.params.countryId) filter = { city: req.params.countryId }

  const cities = await City.find(filter)

  res.status(200).json({
    status: 'success',
    count: cities.length,
    data: {
      cities,
    },
  })
})

export const createCityInCountry = catchAsync(async (req, res, next) => {
  if (!req.body.country) req.body.country = req.params.countryId

  const newCity = await City.create(req.body)

  await Country.findByIdAndUpdate(req.params.countryId, {
    $push: { cities: newCity._id },
  })

  res.status(200).json({
    status: 'success',
    data: {
      newCity,
    },
  })
})
