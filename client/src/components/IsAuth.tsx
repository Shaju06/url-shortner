"use client";
import useSession from "@/useSession";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";

const IsAuth = ({ children }: { children: React.ReactElement }) => {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const pathName = usePathname();

  useEffect(() => {
    if (!session && pathName !== "/" && !isLoading) {
      router.push("/auth");
    }
  }, [session, isLoading]);

  const childrenWithProps = React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      session: true,
    });
  });

  return (
    <>
      {isLoading ? (
        <BarLoader
          color="#2563eb"
          width={"100%"}
          height={"4"}
          cssOverride={{
            flex: 1,
          }}
        />
      ) : (
        childrenWithProps
      )}
    </>
  );

  //   {
  //     childrenWithProps;
  //   }
};

export default IsAuth;
