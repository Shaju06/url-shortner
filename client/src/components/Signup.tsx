"use client";

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
import { ChangeEvent, useEffect, useState } from "react";
import * as Yup from "yup";
import ValidationError from "./ValidationError";
import { signupAction } from "@/app/actions";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/useFetch";

const Signup = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<{
    email: string;
    name: string;
    password: string;
  }>({ name: "", email: "", password: "" });
  const router = useRouter();
  const longLink = useSearchParams().get("createNew");

  const {
    loading,
    error,
    fn: fnSignup,
    data,
  } = useFetch(signupAction, formData);

  useEffect(() => {
    if (error === null && data) {
      router.push(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading]);

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .required("Name is required")
          .max(16, "Name can max 16 character"),
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
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Sign up Form</CardTitle>
        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                type="text"
                placeholder="Enter your name."
                onChange={handleInputChange}
              />
              {errors?.name && <ValidationError message={errors.name} />}
            </div>
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
        <Button size={"lg"} onClick={handleFormSubmit}>
          Signup
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
