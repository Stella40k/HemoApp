import mongoose from "mongoose";
import "config/dotenv"

export const connect = async()=>{
    try {
        const connt = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${connt.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB', error.message);
        process.exit(1);   
    }
};