import mongoose from "mongoose";

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to mongo! Detabase: ', mongoose.connections[0].name)
}

export default connectDB