import mongoose from 'mongoose'
import Tour from './tourModel.js'

const ReviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review cannot be emty!'] },
    rating: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5'],
    },
    createdAt: { type: Date, default: Date.now },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
)

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name surname nationality photo',
  })

  next()
})

ReviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  })
}

ReviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour)
})

export default mongoose.model('Review', ReviewSchema)
