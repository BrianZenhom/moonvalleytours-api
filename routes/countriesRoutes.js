import express from 'express'
import {
  createCountry,
  deleteCountry,
  getAllCountries,
  getCountry,
  updateCountry,
} from '../controllers/countryController.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

// Client routes
router.get('/', getAllCountries)
router.get('/:country', getCountry)

// Admin routes
router.post('/', verifyAdmin, createCountry)
router.put('/:id', verifyAdmin, updateCountry)
router.delete('/:id', verifyAdmin, deleteCountry)

export default router
