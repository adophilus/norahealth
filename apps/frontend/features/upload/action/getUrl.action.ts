"use server";

import { auth } from "@/auth";
import { pinata } from "@/lib/pinata";

export default async function getUrl() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id)
      return { error: "Unauthorized" };

    const url = await pinata.upload.public.createSignedURL({
      expires: 30,
    });
    return { url };
  } catch (error) {
    console.log(error);
    return { error: "Error creating API Key" };
  }
}
