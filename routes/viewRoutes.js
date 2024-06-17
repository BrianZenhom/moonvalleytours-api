import express from 'express'
import { getOverview, getTour } from '../controllers/viewsController'

const router = express.Router()

router.get('/tour/:slug', getTour)

export default router



