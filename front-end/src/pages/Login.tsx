import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loginUserSchema } from "@shared/schema";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginUserSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      console.log("Attempting login with:", { email: data.email });
      const response = await apiRequest("POST", "/api/auth/login", data);
      const result = await response.json();
      console.log("Login response:", result);
      return result;
    },
    onSuccess: (response: any) => {
      console.log("Login successful:", response);
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      // Redirect based on user role with null checking
      if (response?.user?.role === "vendor") {
        setLocation("/vendor-dashboard");
      } else {
        setLocation("/");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kenyan-beige via-white to-kenyan-orange/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="flex items-center justify-center mb-4">
              <i className="fas fa-elephant text-kenyan-orange text-4xl mr-3"></i>
              <h1 className="font-cultural text-3xl font-bold text-kenyan-dark">
                Kifaru Crafts
              </h1>
            </div>
          </Link>
          <p className="text-gray-600">Welcome back to the marketplace</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-cultural text-kenyan-dark">
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          className="h-12"
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
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-kenyan-orange hover:bg-kenyan-red text-white font-semibold"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/register">
                  <span className="text-kenyan-orange hover:text-kenyan-red font-semibold cursor-pointer">
                    Sign up here
                  </span>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}