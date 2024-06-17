import Countries from '../models/countryModel.js'
import catchAsync from '../utils/catchAsync.js'
import { deleteOne, getOne, updateOne } from './handlerFactory.js'

export const createCountry = catchAsync(async (req, res, next) => {
  const newCountry = new Countries(req.body)

  const savedCountry = await newCountry.save()

  res.status(200).json(savedCountry)
})

export const getCountry = getOne(Countries)
export const updateCountry = updateOne(Countries)
export const deleteCountry = deleteOne(Countries)

export const getAllCountries = catchAsync(async (req, res, next) => {
  const regex = new RegExp(req.query.q, 'i')
  const page = req.query.page
  const ITEM_PER_PAGE = 5

  const countries = await Countries.find({ country: { $regex: regex } })
    .limit(ITEM_PER_PAGE)
    .skip(ITEM_PER_PAGE * (page - 1))
    .lean()
  res.status(200).json({
    status: 'success',
    data: {
      countries
    }
  })
})
