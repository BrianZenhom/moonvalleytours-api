import express from 'express'
import {
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
  updatePassword,
  updateMe,
  deleteMe,
} from '../controllers/userController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

// Client routes
router.patch('/updateMyPassword', protect, updatePassword)
router.patch('/updateMe', protect, updateMe)
router.delete('/deleteMe', protect, deleteMe)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

// Admin routes
router.get('/', protect, restrictTo('admin', 'lead-guide'), getAllUsers)

export default router
