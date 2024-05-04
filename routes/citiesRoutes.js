import express from 'express'
import {
  deleteCity,
  getAllCities,
  getCitiesInCountry,
  getCity,
  updateCity,
} from '../controllers/cityController.js'
import { protect, restrictTo } from '../controllers/authController.js'
import { createTourInCity } from '../controllers/tourController.js'

const router = express.Router({ mergeParams: true })

router
  .route('/:countryId/:cityId/tours')
  .post(protect, restrictTo('admin'), createTourInCity)

// Client routes
router.get('/', getAllCities)
router.get('/:id', getCity)
router.get('/in/:country', getCitiesInCountry)

// Admin routes
router.put('/:id', protect, restrictTo('admin', 'lead-guide'), updateCity)

router.delete(
  '/:cityId/:countryId',
  protect,
  restrictTo('admin', 'lead-guide'),
  deleteCity
)

export default router
