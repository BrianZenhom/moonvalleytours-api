import City from '../models/cityModel.js'
import Country from '../models/countryModel.js'
import catchAsync from '../utils/catchAsync.js'
import { getAll, getOne, updateOne } from './handlerFactory.js'

export const getCity = getOne(City, {
  path: 'tours',
  select:
    'title price priceDiscount duration ratingsAverage tourThumbnail cancellation country city slug'
})

export const updateCity = updateOne(City)

export const deleteCity = catchAsync(async (req, res, next) => {
  await City.findByIdAndDelete(req.params.cityId)

  await Country.findByIdAndUpdate(req.params.countryId, {
    $pull: { cities: req.params.cityId }
  })

  res.status(200).json('City deleted!')
})

export const getAllCities = getAll(City)

export const getCitiesInCountry = catchAsync(async (req, res, next) => {
  let filter = {}
  if (req.params.countryId) filter = { city: req.params.countryId }

  const cities = await City.find(filter)

  res.status(200).json({
    status: 'success',
    count: cities.length,
    data: {
      cities
    }
  })
})

export const createCityInCountry = catchAsync(async (req, res, next) => {
  if (!req.body.country) req.body.country = req.params.countryId

  const newCity = await City.create(req.body)

  await Country.findByIdAndUpdate(req.params.countryId, {
    $push: { cities: newCity._id }
  })

  res.status(200).json({
    status: 'success',
    data: {
      newCity
    }
  })
})
