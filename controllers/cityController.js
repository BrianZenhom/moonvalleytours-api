import City from '../models/cityModel.js'
import Country from '../models/countryModel.js'

export const createCity = async (req, res, next) => {
  const countryName = req.params.country
  const newCity = new City(req.body)

  try {
    const savedCity = await newCity.save()
    try {
      await Country.findOneAndUpdate(
        { country: countryName },
        {
          $push: { cities: savedCity._id },
        }
      )
    } catch (err) {
      next(err)
    }
    res.status(200).json(savedCity)
  } catch (err) {
    next(err)
  }
}
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

export const getCitiesInCountry = async (req, res, next) => {
  try {
    const cities = await City.find({ country: req.params.country })
    res.status(200).json(cities)
  } catch (err) {
    next(err)
  }
}
