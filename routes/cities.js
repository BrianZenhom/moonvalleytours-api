import express from 'express'
import {
  createCity,
  deleteCity,
  getAllCity,
  getCitiesInCountry,
  getCity,
  updateCity,
} from '../controllers/city.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

// Client routes
router.get('/', getAllCity)
router.get('/:city', getCity)
router.get('/in/:country', getCitiesInCountry)

// Admin routes
router.put('/:id', verifyAdmin, updateCity)
router.post('/:country', verifyAdmin, createCity)
router.delete('/:cityId/:country', verifyAdmin, deleteCity)

export default router
