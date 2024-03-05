import express from 'express'
import {
  createTour,
  deleteTour,
  getAllTour,
  getTour,
  getToursInCity,
  updateTour,
} from '../controllers/tour.js'
import { verifyAdmin, protect } from '../utils/verifyToken.js'

const router = express.Router()

// Client routes
router.get('/', protect, getAllTour)
router.get('/:id', getTour)
router.get('/in/:city', getToursInCity)

// Admin routes
router.patch('/:id', verifyAdmin, updateTour)
router.post('/:city', verifyAdmin, createTour)
router.delete('/:id/:city', verifyAdmin, deleteTour)

export default router
