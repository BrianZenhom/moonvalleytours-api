import express from 'express'
import {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
} from '../controllers/userController.js'

const router = express.Router()

// Client routes
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

// Admin routes
router.get('/', getAllUsers)

export default router
