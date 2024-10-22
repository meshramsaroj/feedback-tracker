import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { XIcon } from "lucide-react";
import { Message } from "@/models/User";

const MessageCard = ({ message, handleDeleteMessage }: {message: Message, handleDeleteMessage: (messageId: any)=> void}) => {
    const date = new Date(message.createdAt)
  return (
      <Card className="flex items-start justify-between w-full p-3">
        <CardContent>
            {message.content}
            <p className="mt-2 text-gray-600">{date.toDateString()}</p>
        </CardContent>
        <CardFooter>
          <XIcon onClick={()=>handleDeleteMessage(message._id)} />
        </CardFooter>
      </Card>
  );
};

export default MessageCard;
