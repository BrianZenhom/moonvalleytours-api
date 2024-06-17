import express from 'express'
import { getLoginForm, getTour } from '../controllers/viewsController'

const router = express.Router()

router.get('/tour/:slug', getTour)

// Login
router.get('/login', getLoginForm)

export default router
