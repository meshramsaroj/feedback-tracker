"use client";
import MassageInput from "@/components/MassageInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessagesData } from "@/lib/messagesData";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AnonymousDashboard = () => {
  const profileUrl = window.location.pathname.split("/").pop();
  const [message, setMessage] = useState("");
  const router = useRouter();

  return (
    <div className="px-16 py-3">
      <section>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>Send anonymous message to @{profileUrl}</div>
      </section>
      <section className="my-3">
        <MassageInput message={message} />
      </section>
      <section className="flex flex-col w-full">
        <span className="text-lg border-b-black border-b-2 p-2 my-2 font-bold">
          Message suggestion
        </span>
        <p>Click on any below message to select it:</p>
        <div className="flex flex-col items-center justify-center gap-3 my-3">
          {MessagesData.map((message) => (
            <Card
              className="w-10/12 text-center hover:bg-slate-200 cursor-pointer"
              onClick={() => setMessage(message.content)}
              key={message.id}
            >
              <CardContent className="p-4">{message.content}</CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="flex justify-center flex-col gap-3 items-center mt-5">
        <Button onClick={() => router.replace("/sign-up")}>
          Create account
        </Button>
        <p>To get get your message board</p>
      </section>
    </div>
  );
};

export default AnonymousDashboard;
