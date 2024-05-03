import express from 'express'
import {
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} from '../controllers/userController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.get('/me', protect, getMe, getUser)

router.patch('/updateMe', protect, updateMe)
router.delete('/deleteMe', protect, deleteMe)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

// Admin routes
router.get('/', protect, restrictTo('admin', 'lead-guide'), getAllUsers)

export default router
