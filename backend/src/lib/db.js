import mongoose from 'mongoose';
import {ENV} from "../lib/env.js";

export const connectToDB = async () => {
    try{
        const connection = await mongoose.connect(ENV.MONGO_URI);
        console.log(`Connected to MongoDB: ${connection.connection.host}`);
    }
    catch(error){
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}