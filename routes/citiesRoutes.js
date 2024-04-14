import express from 'express'
import {
  createCity,
  createCityInCountry,
  deleteCity,
  getAllCities,
  getCitiesInCountry,
  getCity,
  updateCity,
} from '../controllers/cityController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

router.post(protect, restrictTo('admin'), createCityInCountry)

// Client routes
router.get('/', getAllCities)
router.get('/:city', getCity)
router.get('/in/:country', getCitiesInCountry)

// Admin routes
router.put('/:id', protect, restrictTo('admin', 'lead-guide'), updateCity)
// router.post('/:country', protect, restrictTo('admin', 'lead-guide'), createCity)
router.delete(
  '/:cityId/:country',
  protect,
  restrictTo('admin', 'lead-guide'),
  deleteCity
)

export default router
