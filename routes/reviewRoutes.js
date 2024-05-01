import express from 'express'

import {
  createReview,
  deleteReview,
  getAllReviews,
  setTourUserIds,
  updateReview,
} from '../controllers/reviewController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview)

router.route('/:id').patch(updateReview).delete(deleteReview)

export default router
