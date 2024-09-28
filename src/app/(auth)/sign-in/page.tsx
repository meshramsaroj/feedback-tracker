'use client'
import { useToast } from '@/hooks/use-toast';
import { SignInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z  from 'zod';
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
import { signIn } from 'next-auth/react';

const page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema)
  })

  const onSubmit =async (data: z.infer<typeof SignInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    console.log("result==", result)
   if(result?.error){
    if(result.error =="CredentialsSignin"){
      toast({
        title: "Sign in failed",
        description: "Incorrect usernmae or password",
        variant: 'destructive'
      })
    }else {
      toast({
        title: "Sign in failed",
        description: result.error,
        variant: 'destructive'
      })
    }
   }

   if(result?.url) {
    router.replace('/dashboard')
   }
  }
  return (
    <div>
      <h1>Sign In</h1>
      <div>
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
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" >Login</Button>
          </form>
        </Form>
      </div>
    </div>

  )
}

export default page