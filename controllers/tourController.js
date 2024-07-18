import Tour from '../models/tourModel.js'
import City from '../models/cityModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory.js'
import multer from 'multer'
import sharp from 'sharp'

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! please choose correct file type.', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

export const uploadTourPhotos = upload.fields([{
  name: 'tourThumbnail', maxCount: 1
}, {
  name: 'tourPhotos', maxCount: 5
}])

export const uploadResizeTourPhotos = catchAsync(async (req, res, next) => {
  if (!req.files.tourPhotos || !req.files.tourThumbnail) return next()

  // 1) thumbail image
  req.body.tourThumbnail = `tour-${req.params.id}-${Date.now()}-thumbnail.jpeg`
  await sharp(req.files.tourThumbnail[0].buffer)
    .resize(349, 360)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.tourThumbnail}`)

  // 2) tour photos
  req.body.tourPhotos = []

  await Promise.all(
    req.files.tourPhotos.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`)

      req.body.tourPhotos.push(filename)
    })
  )

  next()
})

export const setCityCountryIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.city) req.body.city = req.params.cityId
  if (!req.body.country) req.body.country = req.params.countryId

  next()
}

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '7'
  req.query.sort = 'price,-ratingsAverage'
  req.query.fields =
    'city, country, title, price, priceDiscount, difficulty, ratingsAverage, cancellation, tourThumbnail'

  next()
}

export const createTour = catchAsync(async (req, res, next) => {
  const city = req.params.cityId
  const newTour = new Tour(req.body)

  const savedTour = await newTour.save()

  await City.findByIdAndUpdate(city, { $push: { tours: savedTour._id } })

  res.status(200).json({
    status: 'success',
    data: {
      savedTour
    }
  })
})

export const getTour = getOne(Tour, { path: 'reviews' })
export const updateTour = updateOne(Tour)
export const deleteTour = deleteOne(Tour)
export const getAllTour = getAll(Tour)

export const getToursInCity = catchAsync(async (req, res, next) => {
  const tours = await Tour.find({ city: req.params.city })

  if (!tours) {
    return next(new AppError('No tours found with that city', 404))
  }

  res.status(200).json({ count: tours.length, tours })
})

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        // grouping by difficulty or city or whatever value we want.
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      // sorting by price, ascending. It has to be with the property defined in the $group
      $sort: { avgPrice: 1 }
    },
    {
      // redefined the match with $ne which stands for not equal.
      $match: { _id: { $ne: 'EASY' } }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  })
})

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  // const year = req.params.year * 1

  const plan = await Tour.aggregate([])

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  })
})

// 41.016022, 28.948162
// tours-distance/233/center/41.016022, 28.948162/unit/mi
export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params
  const [lat, lng] = latlng.split(',')

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    )
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  })
})

export const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params
  const [lat, lng] = latlng.split(',')

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    )
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        title: 1,
        _id: 1,
        tourThumbnail: 1
      }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  })
})
