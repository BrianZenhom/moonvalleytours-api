import express from 'express'

import { createReview, getAllReviews } from '../controllers/reviewController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview)

export default router
