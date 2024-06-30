"use client";

import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
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
import { ChangeEvent, useState } from "react";
import * as Yup from "yup";
import ValidationError from "./ValidationError";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleFormSubmit = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .required("Password is required")
          .min(6, "Password must be atleast 6 character"),
      });

      await schema.validate(formData, { abortEarly: false });
    } catch (err: any) {
      const newErrors: { [key: string]: string } = {};

      err?.inner?.forEach((err: any) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    ("use server");

    const response = await loginAction(formData);

    if (response?.user) {
      router.push("/");
    }

    setIsLoading(false);
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
              {errors?.email && <ValidationError message={errors.email} />}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleInputChange}
              />
              {errors?.password && (
                <ValidationError message={errors.password} />
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex w-full">
        <Button onClick={handleFormSubmit} size={"lg"} disabled={isLoading}>
          Login
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
