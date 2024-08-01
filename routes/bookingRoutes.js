import express from 'express'
import { getCheckoutSession } from './../controllers/bookingController.js'
import { protect } from './../controllers/authController.js'

const router = express.Router()

router.get('/checkout-session/:tourID', protect, getCheckoutSession)

export default router
