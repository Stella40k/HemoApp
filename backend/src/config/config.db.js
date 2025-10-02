import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async() =>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connectd: ${connect.connection.host}`);
    } catch (error) {
        console.log("error al conectar servidor", error);
        process.exit(1);
    }
};