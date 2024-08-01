import Stripe from 'stripe'
import Tour from './../models/tourModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from './../utils/appError.js'

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1 get the current booked tour
  const tour = await Tour.findById(req.params.tourID)

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  const stripe = await Stripe(`${process.env.STRIPE_SECRET_KEY}`)
  // 2 create checkout session
  const session = await stripe.checkout.sessions.create({
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/${tour?.city?.country?.country}/${tour?.city?.city}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          unit_amount: tour.price * 100,
          currency: 'eur',
          product_data: {
            name: `${tour.title} Tour`,
            images: ['https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
            description: tour.desc
          }
        },
        quantity: 1
      }
    ],
    mode: 'payment'
  })

  // 3 create session as response
  res.status(200).json({
    status: 'success',
    session
  })
})
