import mongoose from 'mongoose'

const { model, Schema } = mongoose

const investorSchema = new Schema({
  
        nome: {
          type: String,
        },
        sobrenome: {
          type: String,
        },
        razaoSocial: {
          type: String,
        },
        nomeFantasia: {
          type: String,
        },
        cnpj: {
          type: String,
          required: true,
          unique: true
        },
        endereco: {
          type: String,
        },
        cidade: {
          type: String,
          required: true
        },
        cep: {
          type: String,
          required: true
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
      }, {timestamps: true})

      export default model('Investor', investorSchema)