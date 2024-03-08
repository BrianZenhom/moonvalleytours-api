import express from 'express'
import mongoose from 'mongoose'

import authRoute from './routes/authRoutes.js'
import citiesRoute from './routes/citiesRoutes.js'
import countriesRoute from './routes/countriesRoutes.js'
import toursRoute from './routes/toursRoutes.js'
import usersRoute from './routes/usersRoutes.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'

import AppError from './utils/appError.js'
import globalErrorHandler from './controllers/errorController.js'

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)

  process.exit(1)
})

import 'dotenv/config'

const app = express()

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log('connected to mongodb')
  } catch (err) {
    throw err
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('mongo disconnected!')
})

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      'https://moonvalleytours.com',
    ],
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/tours', toursRoute)
app.use('/api/v1/cities', citiesRoute)
app.use('/api/v1/countries', countriesRoute)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

const PORT = 1234 || process.env.PORT

const server = app.listen(PORT, () => {
  connect()
  console.log(`Listening to app on port http://localhost:${PORT}`)
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION!💥 Shutting down...')
  console.log(err.name, err.message)

  server.close(() => {
    process.exit(1)
  })
})
