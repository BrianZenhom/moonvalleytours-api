import express from 'express'
import {
  createCountry,
  deleteCountry,
  getAllCountries,
  getCountry,
  updateCountry,
} from '../controllers/countryController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.get('/', getAllCountries)
router.get('/:country', getCountry)

// Admin routes
router.post('/', protect, restrictTo('admin', 'lead-guide'), createCountry)
router.put('/:id', protect, restrictTo('admin', 'lead-guide'), updateCountry)
router.delete('/:id', protect, restrictTo('admin', 'lead-guide'), deleteCountry)

export default router
