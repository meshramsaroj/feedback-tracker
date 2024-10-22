"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/User";
import { AcceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { APIResponse } from "@/types/APIResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import {  useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const baseUrl = window?.location.origin

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(AcceptMessagesSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Error fetching accepting messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsMessagesLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<APIResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<APIResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Error fetching messages",
          variant: "destructive",
        });
      } finally {
        setIsMessagesLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsMessagesLoading, messages]
  );

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Error fetching accepting messages",
        variant: "destructive",
      });
    }
  };

  // Copy to clipboard
  console.log(router)
  const profileUrl = `${baseUrl}/u/${session?.user.username}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url copied",
      description: "Profile url copied successfully.",
      variant: "default",
    });
  };

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages(true);
    fetchAcceptingMessages();
  }, []);

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  return (
    <div className="px-16">
      <div>
        <h1 className="text-2xl">Dashboard</h1>

        <div className="flex w-3/4 gap-3">
          <Input value={profileUrl} />
          <Button onClick={handleCopyToClipboard} className="bg-brand">Copy</Button>
        </div>
      </div>
      <div className="my-4 flex items-center gap-2">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="bg-brand"
        />
        <span>Accept messages: {acceptMessages ? "On" : "Off"}</span>
      </div>
      <div className="flex gap-2 my-3">
        <h1 className="text-lg">Messages</h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="text-sm bg-brand"
          variant={"outline"}

        > {isMessagesLoading? 
          <Loader2 size={'sm'} />:
          <RefreshCcw size={'sm'} />
        
        }
        </Button>
      </div>
      <section>
        {isMessagesLoading ? (
          <>Messages are loading please wait</>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-2 gap-5">
            {messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                handleDeleteMessage={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <>Messages are loading</>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
