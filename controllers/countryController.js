import Countries from '../models/countryModel.js'

export const createCountry = async (req, res, next) => {
  const newCountry = new Countries(req.body)

  try {
    const savedCountry = await newCountry.save()
    res.status(200).json(savedCountry)
  } catch (err) {
    next(err)
  }
}
export const getCountry = async (req, res) => {
  try {
    const country = await Countries.findOne({ id: req.params.id })

    res.status(200).json(country)
  } catch (err) {
    next(err)
  }
}
export const updateCountry = async (req, res) => {
  try {
    const updatedCountry = await Countries.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedCountry)
  } catch (err) {
    next(err)
  }
}
export const deleteCountry = async (req, res) => {
  try {
    await Countries.findByIdAndDelete(req.params.id)
    res.status(200).json('Country deleted!')
  } catch (err) {
    next(err)
  }
}
export const getAllCountries = async (req, res, next) => {
  const regex = new RegExp(req.query.q, 'i')
  const page = req.query.page
  const ITEM_PER_PAGE = 5

  try {
    const countries = await Countries.find({ country: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))
      .lean()
    res.status(200).json(countries)
  } catch (err) {
    next(err)
  }
}
