import express from 'express'
import {
  getTour,
  getAllTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  createTour,
  setCityCountryIds,
  getToursWithin,
  getDistances,
  uploadResizeTourPhotos,
  uploadTourPhotos
} from '../controllers/tourController.js'
import { protect, restrictTo } from '../controllers/authController.js'
import reviewRouter from './reviewRoutes.js'

const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

// alias creation, to have certain routes that could be helpful, to not consume too much bandwidth when fetching all tours.
router.get('/top-7-cheapest', aliasTopTours, getAllTour)
router.get('/tour-stats', getTourStats)
router.get(
  '/monthly-plan/:year',
  protect,
  restrictTo('admin', 'lead-guide', 'guide'),
  getMonthlyPlan
)

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin)

router.route('/distances/:latlng/unit/:unit').get(getDistances)

router.get('/', getAllTour).post(protect, restrictTo('admin'), createTour)

router
  .route('/:id')
  .get(getTour)
  .patch(protect, uploadTourPhotos, uploadResizeTourPhotos, restrictTo('admin', 'lead-guide'), updateTour)

router
  .post(
    '/:countryId/:cityId',
    setCityCountryIds,
    protect,
    restrictTo('admin', 'lead-guide'),
    createTour
  )
  .delete('/:id/:city', protect, restrictTo('admin', 'lead-guide'), deleteTour)

export default router
