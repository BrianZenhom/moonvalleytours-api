import express from 'express'
import {
  createTour,
  deleteTour,
  getAllTour,
  getTour,
  getToursInCity,
  updateTour,
} from '../controllers/tour.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/:cityid', verifyAdmin, createTour)
router.get('/in/:city', getToursInCity)
router.put('/:id', verifyAdmin, updateTour)
router.delete('/:id/:cityid', verifyAdmin, deleteTour)
router.get('/:id', getTour)

router.get('/', getAllTour)

export default router
