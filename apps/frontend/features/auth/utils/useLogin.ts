"use client";
import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useAuthenticate, useMiniKit } from "@coinbase/onchainkit/minikit";
import crypto from "crypto";
import { StatusAPIResponse } from "@farcaster/auth-client";
import { toast } from "sonner";
import { signInAction } from "@/features/account/actions/signIn.action";
import { defaultRedirectUrl } from "@/data/routes.data";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function useLogin() {
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState<string>();
  const router = useRouter();

  const { address } = useAccount();
  const { isFrameReady } = useMiniKit();
  const generateNonce = useCallback((length = 32) => {
    const genNonce = crypto.randomBytes(length).toString("hex");
    return genNonce;
  }, []);
  const { update } = useSession();

  // Only call useAuthenticate when in a frame context
  const authResult = useAuthenticate();
  const signInViaFarcaster = authResult?.signIn;

  const handleSuccess = () => {
    update();
    router.push(defaultRedirectUrl);
  };

  // This handles login on TBA and Farcaster (only works inside Farcaster frame)
  const handleSignIn = async () => {
    if (!address || isFetching) return;
    
    // Check if we're in a Farcaster frame context
    if (!isFrameReady || !signInViaFarcaster) {
      toast.error("Farcaster context not available. Please use the QR code sign-in.");
      setIsError("Farcaster context not available");
      return;
    }
    
    setIsFetching(true);
    setIsError(undefined);

    try {
      const nonce = generateNonce();
      const result = await signInViaFarcaster({ nonce });
      if (!result) {
        toast.error("Error signing in via farcaster");
        setIsError("Error signing in via farcaster");
        setIsFetching(false);
        return;
      }
      const { message, signature } = result;

      if (!message || !signature || !nonce) {
        toast.error("Error signing in via farcaster");
        setIsError("Error signing in via farcaster");
        setIsFetching(false);
        return;
      }

      const fidMatch = result.message.match(/farcaster:\/\/fid\/(\d+)/);
      const fid = fidMatch ? Number(fidMatch[1]) : null;

      if (!fid) {
        toast.error("FID not found in message");
        setIsError("FID not found in message");
        setIsFetching(false);
        return;
      }

      const response = await signInAction({
        address,
        message,
        signature,
        nonce,
        fid,
      });

      if ("error" in response) {
        toast.error(response.error);
        setIsError(response.error);
        setIsFetching(false);
        return;
      }

      handleSuccess();
      return;
    } catch (error) {
      console.log(error);
      setIsError("Something went wrong. Please try again.");
      setIsFetching(false);
    }
  };

  // This handles login on other browsers this was created mainly to make development easier
  const handleBrowserSignIn = async (data: StatusAPIResponse) => {
    if (!address || isFetching || !data) return;
    setIsFetching(true);
    setIsError(undefined);

    try {
      const { message, signature, nonce, fid } = data;
      if (!message || !signature || !nonce) {
        toast.error("Message or signature or nonce is missing");
        setIsError("Message or signature or nonce is missing");
        setIsFetching(false);
        return;
      }

      if (!fid) {
        toast.error("FID not found in message");
        setIsError("FID not found in message");
        setIsFetching(false);
        return;
      }

      const response = await signInAction({
        address,
        message,
        signature,
        nonce,
        fid,
      });

      if ("error" in response) {
        toast.error(response.error);
        setIsError(response.error);
        setIsFetching(false);
        return;
      }

      handleSuccess();
      return;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setIsError("Something went wrong");
      setIsFetching(false);
      return;
    }
  };

  return {
    isFetching,
    isError,
    isFrameReady,
    handleSignIn,
    handleBrowserSignIn,
  };
}
