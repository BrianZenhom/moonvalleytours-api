import mongoose from 'mongoose'
import Tour from './tourModel.js'

const ReviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review cannot be emty!'] },
    rating: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5']
    },
    createdAt: { type: Date, default: Date.now },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
)

ReviewSchema.index({ tour: 1, user: 1 }, { unique: true })

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name surname nationality photo'
  })

  next()
})

ReviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ])

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    })
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 5
    })
  }
}

ReviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour)
})

ReviewSchema.post(/^findOneAnd/, async function (doc, next) {
  doc.constructor.calcAverageRatings(doc.tour)

  next()
})

export default mongoose.model('Review', ReviewSchema)
