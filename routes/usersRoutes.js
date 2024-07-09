import express from 'express'
import {
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateMe,
  deleteMe,
  getMe
} from '../controllers/userController.js'
import { protect, restrictTo } from '../controllers/authController.js'
import multer from 'multer'

const upload = multer({ dest: 'public/img/users' })

const router = express.Router()

router.use(protect)
router.get('/me', getMe, getUser)
router.patch('/updateMe', upload.single('photo'), updateMe)
router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin'))
router.get('/', restrictTo('admin', 'lead-guide'), getAllUsers)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

export default router
