"use server";

import { createSuperbaseServerClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  const { email, password } = formData;
  try {
    const supabase = await createSuperbaseServerClient(cookies());
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user };
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
}

export async function signupAction(formData: {
  name: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = formData;
  try {
    const supabase = await createSuperbaseServerClient(cookies());
    const { data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return data;
  } catch (err: any) {
    console.log(`Error in signup:: ${err}`);
    throw new Error(err.message);
  }
}
