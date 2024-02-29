import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import citiesRoute from './routes/cities.js'
import countriesRoute from './routes/countries.js'
import toursRoute from './routes/tours.js'
import usersRoute from './routes/users.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

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

app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/tours', toursRoute)
app.use('/api/cities', citiesRoute)
app.use('/api/countries', countriesRoute)

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  })
})

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || 'Something went wrong'
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})

const PORT = 1234 || process.env.PORT

app.listen(PORT, () => {
  connect()
  console.log(`Listening to app on port http://localhost:${PORT}`)
})
