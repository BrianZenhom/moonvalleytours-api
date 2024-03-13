import express from 'express'
import {
  forgotPassword,
  login,
  protect,
  register,
  resetPassword,
  updatePassword,
  updateMe,
} from '../controllers/authController.js'

const router = express.Router()
router.post('/register', register)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router.patch('/updateMyPassword', protect, updatePassword)

router.patch('/updateMe', protect, updateMe)

export default router
