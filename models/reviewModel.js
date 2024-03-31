import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  // Review
  review: { type: String, required: [true, 'Review cannot be emty!'] },
  // Rating
  rating: {
    type: Number,
    default: 5,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be below 5'],
  },
  createdAt: { type: Date, default: Date.now },
  // ref tour
  tour: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
  ],
  // ref to user
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  ],
})

export default mongoose.model('Review', ReviewSchema)
