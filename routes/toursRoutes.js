import express from 'express'
import {
  createTour,
  deleteTour,
  getAllTour,
  getTour,
  getToursInCity,
  updateTour,
} from '../controllers/tourController.js'
import { verifyAdmin } from '../utils/verifyToken.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.get('/', getAllTour)
router.get('/:id', getTour)
router.get('/in/:city', getToursInCity)

// Admin routes
router.patch('/:id', verifyAdmin, updateTour)
router.post('/:city', protect, createTour)
router.delete('/:id/:city', verifyAdmin, deleteTour)

export default router
