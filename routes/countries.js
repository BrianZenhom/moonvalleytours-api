import express from 'express'
import {
  createCountry,
  deleteCountry,
  getAllCountries,
  getCountry,
  updateCountry,
} from '../controllers/country.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/', verifyAdmin, createCountry)
router.put('/:id', verifyAdmin, updateCountry)
router.delete('/:id', verifyAdmin, deleteCountry)
router.get('/:country', getCountry)

router.get('/', getAllCountries)

export default router
