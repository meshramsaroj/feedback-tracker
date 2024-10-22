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
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Label from "@/components/Label";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const usernameMessageDefaultValue = {
    success: false,
    message: "",
  };
  const [usernameMessage, setUserNameMassage] = useState(
    usernameMessageDefaultValue
  );
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
    setUserNameMassage(usernameMessageDefaultValue);
    try {
      const response = await axios.get(
        `/api/check-username-unique?username=${username}`
      );
      setUserNameMassage(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;

      setUserNameMassage(
        axiosError.response?.data ?? {
          success: false,
          message: "Error checking username",
        }
      );
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      console.log("sign up ui response=", response, data);
      toast({
        title: "success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (username) {
      checkUsernameUnique();
    }
  }, [username]);

  return (
    <div className="sign-up-page flex-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label text="Username" />
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
                    <FormDescription
                      className={
                        usernameMessage.success
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {isCheckingUsername ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Please wait
                        </>
                      ) : (
                        usernameMessage?.message
                      )}
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
                    <Label text="Email" />
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
                    <Label text="Password" />
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 /> <span>Please wait</span>
                    </>
                  ) : (
                    " Sign up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p>
            Already a member? Please{" "}
            <Link href="sign-in" className="text-link">
              sign in here
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
