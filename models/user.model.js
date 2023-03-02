import mongoose from 'mongoose'

const { model, Schema } = mongoose

const movieSchema = new Schema({

  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  profession: {
    type: String
  },
  photo: {
    type: String (URL)
  },
  userType: {
    type: String, 
    enum: ["production","investor","entusiast","professional", "channel"],default:"entusiast"
  },
  contacts: [
     { 
        type: Schema.Types.ObjectId,
        ref: 'User',
     }
      ],
      
  coments: [
     { 
        type: Schema.Types.ObjectId,
        ref: 'Coment',
     }
      ],
      
  post: [
     { 
        type: Schema.Types.ObjectId,
        ref: 'Post',
     }
      ],
      
  likedMovies: [
     { 
        type: Schema.Types.ObjectId,
        ref: 'Movie',
     }
      ],
    }, {timestamps: true})

      export default model('Movie', movieSchema)