import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    surname: { type: String },
    phone: { type: Number },
    nationality: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    role: [
      {
        type: String,
        enum: [
          'Admin',
          'Client',
          'Tour Guide',
          'Editor',
          'Software Engineer',
          'Manager',
          'CEO & Founder',
        ],
        default: 'client',
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)
