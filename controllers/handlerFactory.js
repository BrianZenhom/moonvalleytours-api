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

export const updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedDoc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    })
  })
