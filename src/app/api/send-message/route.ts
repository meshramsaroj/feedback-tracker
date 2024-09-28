import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Is user is accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages.",
        },
        {
          status: 403, // forbidden error status
        }
      );
    }

    const newMessage = { content, createdAt: new Date() }; // creating new Message object
    user.messages.push(newMessage as Message); // pushing new message object into existing user message array like this user:{message: [newMessage]}
    await user.save(); // it will save updated messages into mongoBD database

    return Response.json(
      {
        success: true,
        message: "Message sent successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error sending message.")
    return Response.json(
        {
          success: true,
          message: "Internal server error",
        },
        {
          status: 500,
        }
      );
  }
}
