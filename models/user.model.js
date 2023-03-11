import mongoose from 'mongoose'
import validator from 'validator'

const { model, Schema } = mongoose

const userSchema = new Schema({

  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    validate: {
      validator: value => validator.isEmail(value),
      message: ' the email is invalid. '
    }
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  cpf: {
    type: String
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  profession: {
    type: String
  },
  photo: {
    type: String 
  },
  userType: {
    type: String, 
    enum: ["producer","investor","entusiast","professional", "channel"],default:"entusiast",
    required: true
  },
  contacts: [
     { 
        type: Schema.Types.ObjectId,
        ref: 'User',
     }
      ],
      
  comments: [
     { 
        type: Schema.Types.ObjectId,
        ref: 'Comment',
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

      export default model('User', userSchema)