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

router.post('/:country', verifyAdmin, createCity)
router.get('/in/:country', getCitiesInCountry)
router.put('/:id', verifyAdmin, updateCity)
router.delete('/:id/:city', verifyAdmin, deleteCity)
router.get('/:city', getCity)

router.get('/', getAllCity)

export default router
