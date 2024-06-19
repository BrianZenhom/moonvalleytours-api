import express from 'express'
import { getLoginForm, getOverview, getTour } from '../controllers/viewsController.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.get('/', protect, getOverview)

router.get('/tour/:slug', getTour)

// Login
router.get('/login', getLoginForm)

export default router
