import express from 'express'
import { getLoginForm, getOverview, getTour, updateUserData } from '../controllers/viewsController.js'
import { isLoggedIn, protect } from '../controllers/authController.js'

const router = express.Router()

router.use(isLoggedIn)

router.get('/', getOverview)

router.get('/tour/:slug', getTour)

router.get('/login', getLoginForm)
// Login

router.post('/submit-user-data', protect, updateUserData)

export default router
