"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Lock, Mail } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/trpc/schema/auth";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: signIn } = api.auth.signIn.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [["auth", "getSession"]],
      });

      router.refresh();
      router.push("/");
      toast({
        title: "Success",
        description: "Successfully signed in",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      await signIn({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full items-center flex justify-center flex-col">
      <Card>
        <CardContent className="p-4 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={"email"}
                        prefix={<Mail className="size-4 text-gray-500" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={passwordVisible ? "text" : "password"}
                        prefix={<Lock className="size-4 text-gray-500" />}
                        suffix={
                          passwordVisible ? (
                            <EyeOffIcon
                              className="size-4 text-gray-500"
                              onClick={togglePasswordVisibility}
                            />
                          ) : (
                            <EyeIcon
                              className="size-4 text-gray-500"
                              onClick={togglePasswordVisibility}
                            />
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-end w-full">
                <Link
                  href={"/"}
                  className="text-sm underline hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full text-white">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
