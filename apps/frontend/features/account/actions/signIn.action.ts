"use server";

import { auth, signIn } from "@/auth";
import { getUserByAddress, getUserByFid } from "@/helpers/read-db";
import db from "@/lib/db";
import { neynarClient } from "@/lib/neynar";
import { User } from "@/prisma/generated/prisma";

type SignInActionProps = {
  address: string;
  message: string;
  signature: string;
  nonce: string;
  fid: number;
};

type LoginExisingUserType = {
  address: string;
  message: string;
  signature: string;
  nonce: string;
  user: User;
};

async function loginExistingUser({
  user,
  message,
  signature,
  nonce,
  address,
}: LoginExisingUserType) {
  if (user.walletAddress !== address) {
    return {
      error:
        "Wallet address doesn’t match. Please connect the same wallet you used before.",
    };
  }

  const credentials = { message, signature, nonce, address };
  const response = await signIn("credentials", {
    ...credentials,
    redirect: false,
  });

  if (response?.error) {
    return { error: response.error };
  }
  return { success: "Signed in successfully" };
}

async function loginNewUser({
  message,
  signature,
  nonce,
  address,
  fid,
}: SignInActionProps) {
  const existingUserViaAddress = await getUserByAddress(address);
  if (existingUserViaAddress)
    return { error: "This wallet is linked to another Farcaster account." };

  const farcasterUser = (
    await neynarClient.fetchBulkUsers({
      fids: [fid],
    })
  ).users.at(0);

  if (!farcasterUser) {
    return { error: "Farcaster Account Not Found" };
  }

  const { username, pfp_url, display_name } = farcasterUser;

  await db.user.create({
    data: {
      fid,
      walletAddress: address,
      username,
      pfpUrl: pfp_url,
      displayName: display_name,
    },
  });

  const credentials = { message, signature, nonce, address };
  const response = await signIn("credentials", {
    ...credentials,
    redirect: false,
  });

  console.log("response", response);

  if (response?.error) {
    return { error: response.error };
  }
  return {
    success: "Signed in successfully",
  };
}

export async function signInAction({
  address,
  message,
  signature,
  nonce,
  fid,
}: SignInActionProps) {
  try {
    const session = await auth();
    if (session && session.user && session.user.id) {
      return {
        success: "Already signed in",
      };
    }

    const user = await getUserByFid(fid);

    if (user) {
      return await loginExistingUser({
        user,
        message,
        signature,
        nonce,
        address,
      });
    }

    return await loginNewUser({ message, signature, nonce, address, fid });
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
}
