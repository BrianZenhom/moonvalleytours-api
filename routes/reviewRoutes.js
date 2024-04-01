import express from 'express'

import { createReview, getAllReviews } from '../controllers/reviewController.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.get('/', getAllReviews)

router.post('/', protect, createReview)

export default router
