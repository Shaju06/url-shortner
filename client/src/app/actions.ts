"use server";

import { createClient } from "@/utils/superbase/client";

export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  const { email, password } = formData;
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user };
  } catch (err: any) {
    throw new Error(err.message);
  }
}
