"use client";

import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, FormEvent, useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );

  console.log(formData, "formData");

  const handleFormSubmit = async () => {
    ("use server");

    const respo = await loginAction(formData);
    console.log(respo);
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Login Form</CardTitle>
        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email."
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex w-full">
        <Button onClick={handleFormSubmit} size={"lg"}>
          Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
