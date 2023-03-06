import { model, Schema } from 'mongoose'

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

export default model('Comment', commentSchema)