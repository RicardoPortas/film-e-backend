import mongoose from 'mongoose'

const { model, Schema } = mongoose

const professionalSchema = new Schema({
    
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
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
      }, {timestamps: true})

      export default model('Professional', professionalSchema)