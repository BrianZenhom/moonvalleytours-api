import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

export const deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      return next(new AppError('No document found with that id', 404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  })