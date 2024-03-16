import mongoose from 'mongoose'
import validator from 'validator'

const TourSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  continent: {
    type: [String],
    enum: {
      values: [
        'South America',
        'Africa',
        'Asia',
        'North America',
        'Australia',
        'Europe',
        'Antartica',
      ],
      message:
        'Continents are either: South America, North America, Africa, Asia, Australia, Europe or Antartica',
    },
  },
  title: {
    type: String,
    required: true,
    unique: true,
    maxlength: [40, 'A tour title should be less or equal 40 characters'],
    minlength: [10, 'A tour title must have more or equal than 10 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required, please set a price for this tour'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      // This only points to current doc on NEW doc creation
      validator: function (val) {
        return val < this.price
      },
      message: 'Discount price ({VALUE}) should be below the regular price',
    },
  },
  desc: { type: String },
  duration: { type: String },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult',
    },
  },
  language: { type: String },
  included: { type: [String] },
  notIncluded: { type: [String] },
  cancellation: { type: Boolean, default: false },
  ratingsAverage: {
    type: Number,
    default: 5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: { type: Number, default: 0 },
  travellers: { type: Number, default: 0, min: 0 },
  tourPhotos: { type: [String] },
  tourThumbnail: {
    type: String,
    required: [true, 'A tour must have a thumbnail picture'],
  },
  featured: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
})

export default mongoose.model('Tour', TourSchema)
