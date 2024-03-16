import express from 'express'
import {
  getTour,
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
  getToursInCity,
  aliasTopTours,
} from '../controllers/tourController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

// alias creation, to have certain routes that could be helpful, to not consume too much bandwidth when fetching all tours.
router.get('/top-7-cheapest', aliasTopTours, getAllTour)

// Client routes
router.get('/', protect, getAllTour)
router.get('/:id', getTour)
router.get('/in/:city', getToursInCity)

// Admin routes
router.post('/:city', protect, restrictTo('admin', 'lead-guide'), createTour)
router.patch('/:id', protect, restrictTo('admin', 'lead-guide'), updateTour)
router.delete(
  '/:id/:city',
  protect,
  restrictTo('admin', 'lead-guide'),
  deleteTour
)

export default router
