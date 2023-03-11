import mongoose from 'mongoose';
import crypto from 'crypto';

const { model, Schema } = mongoose;

const nfSchema = new Schema({
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producer',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional'
  },
  invoiceNumber: {
    type: Number,
    required: false,
    unique: true
  },
  invoiceDate: {
    type: String,
    required: false
  },
  invoiceVerification: {
    type: String,
    required: false,
    unique: true
  },
  invoiceAmount: {
    type: Number,
    required: false
  },
  previousValidatorHash: {
    type: String
  },
  validatorHash: {
    type: String,
    required: false
  },
  nfImage: String
}, { timestamps: true });

nfSchema.pre('save', function(next) {
  const nfData = {
    producer: this.producer,
    movie: this.movie,
    invoiceNumber: this.invoiceNumber,
    invoiceDate: this.invoiceDate,
    invoiceVerification: this.invoiceVerification,
    invoiceAmount: this.invoiceAmount,
    nfImage: this.nfImage
  };

  // always set the previous validator hash to the current one before calculating the new one
  this.previousValidatorHash = this.validatorHash;

  const nfDataString = JSON.stringify(nfData);

  this.validatorHash = crypto
    .createHash('sha256')
    .update(nfDataString)
    .digest('hex');

  next();
});

nfSchema.pre('findOneAndUpdate', function (next) {
  const nfData = this.getUpdate();
  const nfDataString = JSON.stringify(nfData);
  nfData.validatorHash = crypto
    .createHash('sha256')
    .update(nfDataString)
    .digest('hex');
  this.update({}, nfData);
  next();
});

export default model('Nf', nfSchema);
