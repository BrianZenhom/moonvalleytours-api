import express from 'express'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoute from './routes/authRoutes.js'
import citiesRoute from './routes/citiesRoutes.js'
import countriesRoute from './routes/countriesRoutes.js'
import toursRoute from './routes/toursRoutes.js'
import usersRoute from './routes/usersRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import viewRoutes from './routes/viewRoutes.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'

import AppError from './utils/appError.js'
import globalErrorHandler from './controllers/errorController.js'

import 'dotenv/config'

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)

  process.exit(1)
})
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// serving static files
app.use(express.static(path.join(__dirname, 'public')))

const connect = async () => {
  await mongoose.connect(process.env.MONGO)
  console.log('connected to mongodb')
}

mongoose.connection.on('disconnected', () => {
  console.log('mongo disconnected!')
})

// Set cors
app.use(cors())

// // Limit Request from same IP
const limiter = rateLimit({
  validate: {
    xForwardedForHeader: false
  },
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, please try again later!'
})
app.use('/api', limiter)

// Body parser
app.use(cookieParser())

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price'
    ]
  })
)

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

app.use('/', viewRoutes)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/tours', toursRoute)
app.use('/api/v1/cities', citiesRoute)
app.use('/api/v1/countries', countriesRoute)
app.use('/api/v1/reviews', reviewRoutes)

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
