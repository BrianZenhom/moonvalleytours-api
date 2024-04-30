import express from 'express'
import {
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
} from '../controllers/userController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

// Admin routes
router.get('/', protect, restrictTo('admin', 'lead-guide'), getAllUsers)

export default router
