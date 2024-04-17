import express from 'express'

import {
  createReview,
  deleteReview,
  getAllReviews,
} from '../controllers/reviewController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview)

router.route('/:id').delete(deleteReview)

export default router
