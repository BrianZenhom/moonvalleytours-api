import express from 'express'
import {
  getTour,
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
  getToursInCity,
} from '../controllers/tourController.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.get('/', getAllTour)
router.get('/:id', getTour)
router.get('/in/:city', getToursInCity)

// Admin routes
router.post('/:city', protect, createTour)
router.patch('/:id', protect, updateTour)
router.delete('/:id/:city', protect, deleteTour)

export default router
