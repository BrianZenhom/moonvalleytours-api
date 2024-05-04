import express from 'express'
import {
  getTour,
  getAllTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController.js'
import { protect, restrictTo } from '../controllers/authController.js'
import reviewRouter from './reviewRoutes.js'

const router = express.Router({ mergeParams: true })

router.use('/:tourId/reviews', reviewRouter)

// alias creation, to have certain routes that could be helpful, to not consume too much bandwidth when fetching all tours.
router.get('/top-7-cheapest', aliasTopTours, getAllTour)
router.get('/tour-stats', getTourStats)
router.get('/monthly-plan/:year', getMonthlyPlan)

// Client routes
router.get('/', getAllTour)
router.get('/:id', getTour)

// Admin routes
// router.post('/:cityId', protect, restrictTo('admin', 'lead-guide'), createTour)
router.patch('/:id', protect, restrictTo('admin', 'lead-guide'), updateTour)
router.delete(
  '/:id/:city',
  protect,
  restrictTo('admin', 'lead-guide'),
  deleteTour
)

export default router
