"use client";

import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  return (
    <section className="flex justify-center mt-10 w-full">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Auth;
