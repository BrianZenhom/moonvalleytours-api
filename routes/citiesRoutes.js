import express from 'express'
import {
  createCity,
  deleteCity,
  getAllCity,
  getCitiesInCountry,
  getCity,
  updateCity,
} from '../controllers/cityController.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.get('/', getAllCity)
router.get('/:city', getCity)
router.get('/in/:country', getCitiesInCountry)

// Admin routes
router.put('/:id', protect, updateCity)
router.post('/:country', protect, createCity)
router.delete('/:cityId/:country', protect, deleteCity)

export default router
