import mongoose from 'mongoose'

const { model, Schema } = mongoose

const movieSchema = new Schema({
        title: {
          type: String,
          required: [true, 'O título é obrigatório']
        },
        year: {
          type: Number,
        },
        yearAproved: {
          type: Number,
          required: [true, 'O ano de aprovação na ANCINE é Obrigatório']
        },
        salic: {
          type: Number,
          required: [true, 'O número de aprovação SALIC é obrigatório']
        },
        proposer: {
          type: String,
          required: [true, 'O número de aprovação SALIC é obrigatório']
        },
        posterUrl: {
          type: String
        },
        uf:{
          type: String,
          required: [true, 'O Estado de origem do projeto é obrigatório']
        },
        processNumber: {
            type: String,
            required: [true, 'O número do processo na ANCINE obrigatório']
        },
        plot: {
          type: String
        },
        generes: {
          type: [String]
        },
        directors: {
          type: [String]
        },
        writers: {
          type: [String]
        },
        cast: [{
          type: Schema.Types.ObjectId,
          ref: "Star"
        }],
        comments: [{
          type: Schema.Types.ObjectId,
          ref: "Comment"
        }],
        Crew: [{
          type: Schema.Types.ObjectId,
          ref: "Professional"
        }],
        Investor: [{
          type: Schema.Types.ObjectId,
          ref: "Investor"
        }],
        Producer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producer',
        }
      }, {timestamps: true})

      export default model('Movie', movieSchema)
