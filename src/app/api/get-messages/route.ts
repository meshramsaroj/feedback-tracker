import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET() {
    await dbConnect();
  
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
  
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }
  
    const userId = new mongoose.Types.ObjectId(user._id); // converting stringed userId as per mongoDB readable userId

    try {
        
        const user = await UserModel.aggregate([
            {$match: {id: userId}}, // find user based on userId
            {$unwind: "$messages"}, // it will convert messages array into individual object like this {messages: []} => {id: 1, username: "test", messages: {content: "random text"}}
            {$sort: {'messages.createdAt': -1}}, // to get messages in ascending order
            {$group: {                              //
                _id: "$_id",                        //it will return all the updated details by grouping together 
                messages: {$push: "$messages"}      //
            }}
        ])

        if(!user || user.length ===0){
            return Response.json(
                {
                  success: false,
                  message: "User not found",
                },
                {
                  status: 401,
                }
              );
        }

            return Response.json(
            {
              success: true,
              messages: user[0].messages
            },
            {
              status: 401,
            }
          );
    } catch (error) {
        console.log("Error getting messages")
        return  Response.json(
            {
              success: false,
              message: "Error getting messages",
            },
            {
              status: 500,
            }
          );
    }
}