import express from 'express'
import {
  updateUser,
  getUser,
  getAllUsers,
} from '../controllers/userController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.route('/:id').get(getUser).put(updateUser)

// Admin routes
router.get('/', protect, restrictTo('admin', 'lead-guide'), getAllUsers)

export default router
