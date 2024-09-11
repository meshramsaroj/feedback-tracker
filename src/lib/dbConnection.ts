import mongoose from "mongoose";
import { number } from "zod";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connection to database")
        return
    }

    try{
        const db =  await mongoose.connect(process.env.MONGODB_URI || '', {})
         connection.isConnected  =mongoose.connections[0].readyState
        console.log("DB connected successfully")
    }catch(e) {
        console.log("DB connection failed")
        process.exit(1)
    }
}

export default dbConnect