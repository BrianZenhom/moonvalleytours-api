import express from 'express'
import {
  createCityInCountry,
  deleteCity,
  getAllCities,
  getCitiesInCountry,
  getCity,
  updateCity,
} from '../controllers/cityController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router({ mergeParams: true })

router.post('/', protect, restrictTo('admin'), createCityInCountry)

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
