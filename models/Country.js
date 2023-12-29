import mongoose from 'mongoose'

const CountrySchema = new mongoose.Schema(
  {
    country: { type: String, required: true, unique: true },
    continents: { type: [String] },
    cities: { type: [String] },
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsQuantity: { type: Number, default: 0 },
    travellers: { type: Number, default: 0, min: 0 },
    countryCover: { String },
    countryThumbnail: { String },
  },
  { timestamps: true }
)

export default mongoose.model('Countries', CountrySchema)
