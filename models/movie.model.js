import mongoose from 'mongoose'

const { model, Schema } = mongoose

const movieSchema = new Schema({
        title: {
          type: String,
          required: true
        },
        year: {
          type: Number,
          required: true
        },
        yearAproved: {
          type: Number,
          required: true
        },
        salic: {
          type: Number,
          required: true
        },
        proposer: {
          type: String,
          required: true
        },
        uf:{
          type: String,
          required: true
        },
        processNumber: {
            type: String,
            required: true
        },
        posterUrl: {
          type: String
        },
        plot: {
          type: String
        },
        genres: {
          type: [String]
        },
        directors: {
          type: [String]
        },
        writers: {
          type: [String]
        },
        actors: {
          type: [String]
        },
        company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Company',
        }
      }, {timestamps: true})

      export default model('Movie', movieSchema)