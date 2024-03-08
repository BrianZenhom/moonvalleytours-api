import express from 'express'
import {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
} from '../controllers/userController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

// Admin routes
router.get('/', protect, restrictTo('admin', 'lead-guide'), getAllUsers)

export default router
