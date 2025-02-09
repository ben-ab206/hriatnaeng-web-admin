"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";
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
import { setPasswordSchema } from "@/trpc/schema/auth";
import { useEffect, useState } from "react";
import { api } from "@/trpc/client";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const DefinePasswordView = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Get access token from URL hash
  const getTokens = (): {
    accessToken: string | null;
    refreshToken?: string | null;
  } => {
    if (typeof window === "undefined")
      return { accessToken: null, refreshToken: null };
    const hash = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(hash);
    return {
      accessToken: urlParams.get("access_token"),
      refreshToken: urlParams.get("refresh_token"),
    };
  };

  const form = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const { data: user, refetch } = api.users.getMe.useQuery();

  const { mutateAsync: updatePassword } = api.users.definePassword.useMutation({
    onSuccess: async () => {
      router.push("/");
      toast({
        title: "Success",
        description: "Successfully set password",
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

  const { mutateAsync: setSession } = api.auth.setSessionByToken.useMutation();

  const onSubmit = async (values: z.infer<typeof setPasswordSchema>) => {
    if (user && user.email) {
      await updatePassword({
        email: user.email,
        password: values.password,
      });
    } else {
      toast({
        title: "Error",
        description: "Can't get user session data. please log in.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleAuth = async () => {
      const { accessToken, refreshToken } = getTokens();
      
      if (accessToken && refreshToken) {
        await setSession({
          accessToken,
          refreshToken,
        });

        window.history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search
        );

        await refetch();
      }
    };

    handleAuth();
  }, [pathname, router]);

  return (
    <div className="min-h-screen w-full items-center flex justify-center flex-col">
      <Card>
        <CardContent className="p-4 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
              <Button type="submit" className="w-full text-white">
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefinePasswordView;
