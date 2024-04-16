import City from '../models/cityModel.js'
import Country from '../models/countryModel.js'
import catchAsync from '../utils/catchAsync.js'

// export const createCity = catchAsync(async (req, res, next) => {
//   const countryId = req.params.countryId
//   const newCity = await City.create(req.body)

//   await Country.findOneAndUpdate(
//     { country: countryId },
//     {
//       $push: { cities: newCity._id },
//     }
//   )

//   res.status(200).json({
//     status: 'success',
//     data: { savedCity },
//   })
// })
export const getCity = async (req, res, next) => {
  try {
    const city = await City.findOne({ id: req.params.id }).populate('tours')
    res.status(200).json(city)
  } catch (err) {
    next(err)
  }
}
export const updateCity = async (req, res, next) => {
  try {
    const updatedCity = await Countries.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedCity)
  } catch (err) {
    next(err)
  }
}
export const deleteCity = async (req, res, next) => {
  const country = req.params.country

  try {
    await City.findByIdAndDelete(req.params.cityId)
    try {
      await Country.findOneAndUpdate(
        { country: country },
        {
          $pull: { cities: req.params.cityId },
        }
      )
    } catch (err) {
      next(err)
    }
    res.status(200).json('City deleted!')
  } catch (err) {
    next(err)
  }
}
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
  console.log('hey')
  // In the form to create a new city, we assign the country selected into the POST
  if (!req.body.country) req.body.country = req.params.countryId

  const newCity = await City.create(req.body)

  res.status(200).json({
    status: 'success',
    data: {
      newCity,
    },
  })
})
