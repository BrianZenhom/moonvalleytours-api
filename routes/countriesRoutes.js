import express from 'express'
import {
  createCountry,
  deleteCountry,
  getAllCountries,
  getCountry,
  updateCountry,
} from '../controllers/countryController.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.get('/', getAllCountries)
router.get('/:country', getCountry)

// Admin routes
router.post('/', protect, createCountry)
router.put('/:id', protect, updateCountry)
router.delete('/:id', protect, deleteCountry)

export default router
