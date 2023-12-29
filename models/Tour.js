import mongoose from 'mongoose'

const TourSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    country: { type: String, required: true },
    continent: { type: [String] },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String },
    duration: { type: String },
    language: { type: String },
    included: { type: [String] },
    notIncluded: { type: [String] },
    accessibility: { type: Boolean, default: false },
    cancellation: { type: Boolean, default: false },
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsQuantity: { type: Number, default: 0 },
    travellers: { type: Number, default: 0, min: 0 },
    tourPhotos: { type: [String] },
    tourThumbnail: { String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Tour', TourSchema)
