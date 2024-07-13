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

export async function getLongUrl(id: number) {
  const supabase = await createSuperbaseServerClient(cookies());
  let { data: shortLinkData, error: shortLinkError } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }

  return shortLinkData;
}

interface Params {
  title: string;
  longUrl: string;
  customUrl: string;
  user_id: string;
}

export async function createUrl(
  { title, longUrl, customUrl, user_id }: Params,
  qrcodeBase64: string
) {
  console.log(title, longUrl, customUrl, user_id, qrcodeBase64);
  const short_url = Math.random().toString(36).substring(2, 6);
  const fileName = `qr-${short_url}`;
  const supabase = await createSuperbaseServerClient(cookies());

  const base64Response = await fetch(`data:image/jpeg;base64,${qrcodeBase64}`);

  const blob = await base64Response.blob();

  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(fileName, blob);

  if (storageError) throw new Error(storageError.message);

  const qr = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/qrs/${fileName}`;

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr_code: qr,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating short URL");
  }

  return data;
}

export async function getUrls(user_id: string) {
  const supabase = await createSuperbaseServerClient(cookies());
  let { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }

  return data;
}

export async function getUrl({ id, user_id }: { id: string; user_id: string }) {
  const supabase = await createSuperbaseServerClient(cookies());
  console.log(id, user_id, "payloa");

  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Short Url not found");
  }

  return data;
}

export async function deleteUrl(id: { id: string }) {
  const supabase = await createSuperbaseServerClient(cookies());
  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Unable to delete Url");
  }

  return data;
}
