"use client";
import { useToast } from "@/hooks/use-toast";
import { SignInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSearchParams } from "next/navigation";

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
import { signIn } from "next-auth/react";
import AuthError from "next-auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const SignIn = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    const result = await signIn("credential", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    await alert(`result== ${JSON.stringify(result)}`);

    if (result?.error) {
      if (result.error == "CredentialSignin") {
        toast({
          title: "Sign in failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign in failed",
          description: result.error,
          variant: "destructive",
        });

        router.replace(`/verify/${data.identifier}`)
      }
    }

    // if login success
    if (result?.url) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="sign-in-page flex-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name={"identifier"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address/ Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                <Button type="submit">Login</Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            Not a registered member? Please
            <Link href="/sign-up" className="text-link ms-1">
              sign up here
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
