import express from 'express'
import {
  createCountry,
  deleteCountry,
  getAllCountries,
  getCountry,
  updateCountry,
} from '../controllers/countryController.js'
import { protect, restrictTo } from '../controllers/authController.js'
import citiesRouter from './citiesRoutes.js'

const router = express.Router()

router.use('/:countryId/cities', citiesRouter)

// Client routes
router.get('/:id', getCountry)
router.get('/', getAllCountries)

// Admin routes
router.post('/', protect, restrictTo('admin', 'lead-guide'), createCountry)
router.put('/:id', protect, restrictTo('admin', 'lead-guide'), updateCountry)
router.delete('/:id', protect, restrictTo('admin', 'lead-guide'), deleteCountry)

export default router
