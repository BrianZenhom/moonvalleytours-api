import crypto from 'crypto'
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
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      // This only works on CREATE and SAVE
      validate: {
        validator: function (el) {
          return el === this.password
        },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    photo: { type: String },
    name: { type: String, required: [true, 'Please tell us your name!'] },
    surname: { type: String, required: [true, 'Please tell us your surname'] },
    phone: { type: String },
    country: { type: String, required: true },
    city: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, select: false },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user'
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined

  next()
})

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()

  // 1000 is a second in the past, to ensure the token is created after the password has been changed.
  this.passwordChangedAt = Date.now() - 1000
  next()
})

UserSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } })
  next()
})

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    return JWTTimestamp < changedTimestamp
  }

  return false
}

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

export default mongoose.model('User', UserSchema)
