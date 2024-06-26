import express from 'express'
import {
  forgotPassword,
  login,
  logout,
  protect,
  register,
  resetPassword,
  updatePassword
} from '../controllers/authController.js'

const router = express.Router()
router.patch('/updateMyPassword', protect, updatePassword)

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

export default router
