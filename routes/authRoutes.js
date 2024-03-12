import express from 'express'
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

export default router
