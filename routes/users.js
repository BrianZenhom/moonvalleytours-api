import express from 'express'
import {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
} from '../controllers/user.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

// Client routes
router.get('/:id', verifyUser, getUser)
router.put('/:id', verifyUser, updateUser)
router.delete('/:id', verifyUser, deleteUser)

// Admin routes
router.get('/', verifyAdmin, getAllUsers)

export default router
