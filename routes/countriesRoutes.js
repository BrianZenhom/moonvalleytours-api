import express from 'express'
import {
  createCountry,
  deleteCountry,
  getAllCountries,
  getCountry,
  updateCountry,
  // createCityInCountry,
} from '../controllers/countryController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.get('/:country', getCountry)
router.get('/', getAllCountries)

// Admin routes
router.post('/', protect, restrictTo('admin', 'lead-guide'), createCountry)
router.put('/:id', protect, restrictTo('admin', 'lead-guide'), updateCountry)
router.delete('/:id', protect, restrictTo('admin', 'lead-guide'), deleteCountry)

// router
//   .route('/:countryId/cities')
//   .post(protect, restrictTo('admin'), createCityInCountry)

export default router
