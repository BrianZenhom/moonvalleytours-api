import mongoose from 'mongoose'

const CountrySchema = new mongoose.Schema(
  {
    country: { type: String, required: true, unique: true },
    continents: { type: [String] },
    cities: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'City',
      },
    ],
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsQuantity: { type: Number, default: 0 },
    travellers: { type: Number, default: 0, min: 0 },
    countryCover: { type: String },
    countryThumbnail: { type: String },
  },
  { timestamps: true }
)

CountrySchema.pre(/^findOne/, function (next) {
  this.populate({
    path: 'cities',
    select: 'city ratingsAverage ratingsQuantity CityThumbnail',
  })

  next()
})

export default mongoose.model('Countries', CountrySchema)
