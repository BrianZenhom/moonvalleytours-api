import mongoose from 'mongoose'

const CitySchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    tours: { type: [String] },
    ratingsAverage: { type: Number, default: 5, min: 0, max: 5 },
    ratingsQuantity: { type: Number, default: 0 },
    travellers: { type: Number, default: 0, min: 0 },
    CityCover: { String },
    CityThumbnail: { String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('City', CitySchema)
