import mongoose from 'mongoose'
import slugify from 'slugify'

const TourSchema = new mongoose.Schema(
  {
    city: { type: mongoose.Schema.ObjectId, ref: 'City' },
    country: { type: mongoose.Schema.ObjectId, ref: 'Countries' },
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
          'Antartica'
        ],
        message:
          'Continents are either: South America, North America, Africa, Asia, Australia, Europe or Antartica'
      }
    },
    title: {
      type: String,
      required: true,
      unique: true,
      maxlength: [40, 'A tour title should be less or equal 40 characters'],
      minlength: [
        10,
        'A tour title must have more or equal than 10 characters'
      ]
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'Price is required, please set a price for this tour']
    },
    priceDiscount: {
      type: Number,
      validate: {
        // This only points to current doc on NEW doc creation
        validator: function (val) {
          return val < this.price
        },
        message: 'Discount price ({VALUE}) should be below the regular price'
      }
    },
    desc: { type: String },
    shortDesc: { type: String },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
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
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: { type: Number, default: 0 },
    travellers: { type: Number, default: 0, min: 0 },
    tourPhotos: { type: [String] },
    tourThumbnail: {
      type: String,
      required: [true, 'A tour must have a thumbnail picture']
    },
    featured: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
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

TourSchema.index({ price: 1, ratingsAverage: -1 })
TourSchema.index({ slug: 1 })
TourSchema.index({ startLocation: '2dsphere' })

TourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

TourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

TourSchema.pre('save', function (next) {
  this.slug = slugify(this.title, {
    lower: true
  })

  next()
})

TourSchema.pre(/^find/, function (next) {
  this.find({
    secretTour: {
      $ne: true
    }
  })
  this.start = Date.now()

  next()
})

TourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'city',
    select: 'city _id'
  })

  next()
})

export default mongoose.model('Tour', TourSchema)
