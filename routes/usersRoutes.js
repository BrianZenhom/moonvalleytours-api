import express from 'express'
import {
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto
} from '../controllers/userController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

router.use(protect)
router.get('/me', getMe, getUser)
router.patch('/updateMe', uploadUserPhoto, updateMe)
router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin'))
router.get('/', restrictTo('admin', 'lead-guide'), getAllUsers)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

export default router
