import express from 'express'
import {
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} from '../controllers/userController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

router.use(protect)

router.get('/me', getMe, getUser)
router.patch('/updateMe', updateMe)
router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin'))
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)
router.get('/', restrictTo('admin', 'lead-guide'), getAllUsers)

export default router
