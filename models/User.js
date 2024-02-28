import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      // This only works on CREATE and SAVE
      validate: {
        validator: function (el) {
          return el === this.password
        },
        message: 'Passwords are not the same!',
      },
    },
    photo: { type: String },
    name: { type: String, required: [true, 'Please tell us your name!'] },
    surname: { type: String, required: [true, 'Please tell us your surname'] },
    phone: { type: Number },
    nationality: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    role: {
      type: String,
      default: 'client',
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete passwordConfirm field
  this.passwordConfirm = undefined

  next()
})

export default mongoose.model('User', UserSchema)
