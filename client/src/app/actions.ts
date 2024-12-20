"use server";

import { createSuperbaseServerClient } from "@/utils/superbase/server";

import { UAParser } from "ua-parser-js";

export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  const { email, password } = formData;

  try {
    const supabase = await createSuperbaseServerClient();
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!data?.user) {
      throw new Error("Invalid email/password");
    }
    return { user: data.user };
  } catch (err: any) {
    console.log("Error fetch result: ", err);
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
    const supabase = await createSuperbaseServerClient();
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

export async function getLongUrl({ redirectId }: { redirectId: number }) {
  const supabase = await createSuperbaseServerClient();
  let { data: shortLinkData, error: shortLinkError } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${redirectId},custom_url.eq.${redirectId}`)
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
  const short_url = Math.random().toString(36).substring(2, 6);
  const fileName = `qr-${short_url}`;
  const supabase = await createSuperbaseServerClient();

  try {
    const base64Response = await fetch(
      `data:image/jpeg;base64,${qrcodeBase64}`
    );
    const blob = await base64Response.blob();

    // Upload QR code to Supabase storage
    const { error: storageError } = await supabase.storage
      .from("qrcode")
      .upload(fileName, blob);

    if (storageError) {
      console.error("Storage upload error:", storageError);
      throw new Error(`Failed to upload QR code: ${storageError.message}`);
    }

    const qr = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/qrcode/${fileName}`;

    // Insert URL data into the database
    const { data, error } = await supabase
      .from("urls")
      .insert([
        {
          title,
          user_id,
          original_url: longUrl,
          custom_url: customUrl || null,
          short_url: short_url,
          qr: qr,
        },
      ])
      .select();

    if (error) {
      console.error("Database insertion error:", error);
      throw new Error(
        "Error creating short URL. Check database constraints and values."
      );
    }

    console.log("URL created successfully:", data);
    return data;
  } catch (err: any) {
    console.error("An error occurred in createUrl function:", err);
    throw new Error(`createUrl failed: ${err.message}`);
  }
}

export async function getUrls(user_id: string) {
  try {
    const supabase = await createSuperbaseServerClient();
    let { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      console.error(error);
      throw new Error("Unable to load URLs");
    }
    return data;
  } catch (err: any) {
    console.error("An error occurred in getUrls function:", err);
    throw new Error(`createUrl failed: ${err.message}`);
  }
}

export async function getUrl({ id, user_id }: { id: string; user_id: string }) {
  const supabase = await createSuperbaseServerClient();
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
  const supabase = await createSuperbaseServerClient();
  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  console.log(data, error, id, "fsdf");

  if (error) {
    console.error(error);
    throw new Error("Unable to delete Url");
  }

  return data;
}

export async function getVisitedUrls({ urlIds }: { urlIds: string[] }) {
  try {
    const supabase = await createSuperbaseServerClient();

    const { data, error } = await supabase
      .from("url_visits")
      .select("*")
      .in("url_id", urlIds);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err: any) {
    console.error("Error fetching visits:", err.message);
    return "Some thing went wrong";
  }
}

export const storeVisits = async ({
  id,
  original_url,
}: {
  id: string;
  original_url: string;
}) => {
  try {
    const parser = new UAParser();
    const res = parser.getResult();
    const device = res?.device?.type || "desktop";
    const supabase = await createSuperbaseServerClient();

    const response = await fetch("https://ipapi.co/json");
    const {
      city,
      country_name: country,
      latitude: lat,
      longitude: lng,
    } = await response.json();

    const result = await supabase.from("url_visits").insert({
      url_id: id,
      city,
      country,
      device,
      lat,
      lng,
    });

    return { redirectTo: original_url };
  } catch (error) {
    console.error("Error recording click:", error);
  }
};
