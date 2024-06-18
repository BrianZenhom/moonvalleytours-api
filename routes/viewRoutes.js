import express from 'express'
import { getLoginForm, getOverview, getTour } from '../controllers/viewsController.js'

const router = express.Router()

router.get('/', getOverview)

router.get('/tour/:slug', getTour)

// Login
router.get('/login', getLoginForm)

export default router
