"use client";
import React, { Fragment } from "react";
import { useAccount, useConnect } from "wagmi";
import { cn } from "@/lib/utils";
import ButtonAction from "@/components/ButtonAction";
import Loader from "@/components/Loader";
import useLogin from "@/features/auth/utils/useLogin";
import SignInOnBrowsers from "./SignInOnBrowsers";
import { CircleAlertIcon, Loader2 } from "lucide-react";
import { shortenAddress } from "@/utils";

export default function Login() {
  const { isError, isFetching, isFrameReady, handleSignIn, handleBrowserSignIn } = useLogin();
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <Fragment>
      <div className="w-full flex flex-col gap-4">
        {isError && (
          <div className="w-full border border-red-600 flex items-center justify-start gap-2 rounded-lg p-2 bg-red-50">
            <CircleAlertIcon className="size-4 text-red-600" />
            <p className="text-red-600 text-left">Something went wrong</p>
          </div>
        )}

        <p className="capitalize text-center">
          Connect wallet and Farcaster account to continue
        </p>
        <div className="w-full grid grid-cols-1 gap-4">
          <ButtonAction
            onClick={() => connect({ connector: connectors[0] })}
            btnType="primary"
            className={cn("w-full flex items-center justify-center")}
          >
            {isFetching || isConnecting || isReconnecting ? (
              <Loader2 className="size-6 text-white animate-spin" />
            ) : address ? (
              shortenAddress(address)
            ) : (
              "Connect Wallet"
            )}
          </ButtonAction>

          {/* Only show MiniKit sign-in when inside a Farcaster frame */}
          {isConnected && address && isFrameReady && (
            <div className="w-full grid grid-cols-1 gap-4">
              <ButtonAction
                disabled={!address}
                onClick={handleSignIn}
                btnType="primary"
                className={cn("w-full", { hidden: !address })}
              >
                Login with Farcaster
              </ButtonAction>
            </div>
          )}

          {/* Show browser sign-in when not in a frame, or as fallback */}
          {!isFrameReady && (
            <div>
              <p className="text-[10px] text-muted-foreground text-center">
                Sign in with Farcaster using QR code
              </p>
            </div>
          )}

          <SignInOnBrowsers handleBrowserSignIn={handleBrowserSignIn} />
        </div>
      </div>

      <Loader isLoading={isFetching} loaderText="Connecting..." />
    </Fragment>
  );
}
