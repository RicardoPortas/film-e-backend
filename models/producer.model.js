import mongoose from 'mongoose'

const { model, Schema } = mongoose

const producerSchema = new Schema({

        razaoSocial: {
          type: String,
          required: true
        },
        nomeFantasia: {
          type: String,
          required: true
        },
        cnpj: {
          type: String,
          required: true,
          unique: true
        },
        enderecoRegistro: {
          type: String,
          required: true
        },
        cidade: {
          type: String,
          required: true
        },
        cep: {
          type: String,
          required: true
        },
        cnaes: {
          type: [String],
          required: true
        },
        registroANCINE: {
          type: [String],
          required: true
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        movie: {
          type: Schema.Types.ObjectId,
          ref: 'Movie',
        }
      }, {timestamps: true})

      export default model('Producer', producerSchema)