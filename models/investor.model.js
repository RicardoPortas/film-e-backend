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
          unique: true
        },
        endereco: {
          type: String,
        },
        cidade: {
          type: String,
        },
        cep: {
          type: String,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
      }, {timestamps: true})

      export default model('Investor', investorSchema)