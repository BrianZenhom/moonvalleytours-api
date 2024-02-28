import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
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

export default mongoose.model('User', UserSchema)
