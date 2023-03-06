import mongoose from 'mongoose'

const { model, Schema } = mongoose

const budgetSchema = new Schema({

    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
      movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
      },
      professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
      invoiceNumber: {
        type: String,
        required: true
      },
      invoiceDate: {
        type: Date,
        required: true
      },
      invoiceVerification: {
        type: String,
        required: true
      },
      invoiceAmount: {
        type: Number,
        required: true
      },
      nonce: {
        type: Number,
        required: true
      },
      }, {timestamps: true})

      export default model('Budget', budgetSchema)