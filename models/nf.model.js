import mongoose from 'mongoose'
import crypto from 'crypto'

const { model, Schema } = mongoose

const nfSchema = new Schema({

    company: {
      type: String,
        required: false
      },
      movie: {
        type: String,
        required: false
      },
      invoiceNumber: {
        type: String,
        required: true
      },
      invoiceDate: {
        type: String,
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
      previousValidatorHash: {
        type: String,
        default: null
      },
      validatorHash: {
        type: String,
        required: false
      },
      nfImage: String,

      }, {timestamps: true})

      nfSchema.pre('save', function (next) {
        const invoiceData = {
          company: this.company,
          movie: this.movie,
          invoiceNumber: this.invoiceNumber,
          invoiceDate: this.invoiceDate,
          invoiceVerification: this.invoiceVerification,
          invoiceAmount: this.invoiceAmount,
          nfImage: this.nfImage,
          previousValidatorHash: this.previousValidatorHash
        }
        
        if (this.isNew) {
          this.validatorHash = crypto.createHash('sha256').update(JSON.stringify(invoiceData)).digest('hex')
        } else {
          this.previousValidatorHash = this.validatorHash
          invoiceData.previousValidatorHash = this.previousValidatorHash
          this.validatorHash = crypto.createHash('sha256').update(JSON.stringify(invoiceData)).digest('hex')
        }
        
        next()
      })

      export default model('Nf', nfSchema)