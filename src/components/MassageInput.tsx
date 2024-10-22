import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSchema } from "@/schemas/messageSchema";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { APIResponse } from "@/types/APIResponse";

type MessageInputType = {
  message?: string;
};
const MassageInput = ({ message }: MessageInputType) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const { register, setValue, handleSubmit } = form;

  const setMessageContent = (e: any) => {
    const { value } = e.target;
    setContent(value);
    setValue("content", value);
  };

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    try {
      const response = await axios.post("/api/send-message", {
        username: session?.user.username,
        content: data.content,
      });
      toast({
        title: "Success",
        description: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error sending message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setValue("content", "");
      setContent("");
    }
  };

  useEffect(()=>{
    if (message) {
      setContent(message);
      setValue("content", message);
    }
  }, [message])

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className=" flex flex-col justify-start items-start w-full gap-1.5">
          <Label htmlFor="message" className="font-bold text-lg">
            Your message
          </Label>
          <Textarea
            placeholder="Type your message here..."
            id="message"
            rows={4}
            {...register("content")}
            onChange={setMessageContent}
            className="lg:w-8/12"
            value={content}
          />
          <Button type="submit" className="my-3">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MassageInput;
