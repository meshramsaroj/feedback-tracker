"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/APIResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [userMessage, setUserMassage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const debounced = useDebounceCallback(setUsername, 800);
  const { toast } = useToast();
  const router = useRouter();

  // Zod implementation
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkUsernameUnique = async () => {
      setIsCheckingUsername(true);
      setUserMassage("");
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        console.log("response==", response.data);
        setUserMassage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<APIResponse>;
        console.log("error response==", axiosError.response);

        setUserMassage(
          axiosError.response?.data.message ?? "Error username checking"
        );
      } finally {
        setIsCheckingUsername(false);
      }
  };

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      console.log("sign up ui response=", response, data);
      toast({
        title: "success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`)

    } catch (error) {
      console.log("error");
      const axiosError = error as AxiosError<APIResponse>
      const errorMessage = axiosError.response?.data.message
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if(username){
      checkUsernameUnique();
    }
  }, [username]);

  return (
    <div className="outer">
      <div className="home-page-description"></div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                  {isCheckingUsername ? <><Loader2 className="animate-spin" />Please wait</>: userMessage}

                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>{isSubmitting? <><Loader2 /> <span>Please wait</span></>: " Sign up"}</Button>
          </form>
        </Form>
      </div>
      <div className="already-member">
        <h3>Already a member </h3>
      </div>
    </div>
  );
};

export default page;
