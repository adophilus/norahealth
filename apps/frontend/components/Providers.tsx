"use client";

import { useEffect, useState, type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import sdk from "@farcaster/miniapp-sdk";
import { useAccount, WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/config";
import store from "@/redux";
import { Provider } from "react-redux";
import { useAppDispatch, useIsAddressOnChainAndPremium } from "@/utils";
import { SessionProvider, useSession } from "next-auth/react";
import {
  resetOnChainState,
  resetUser,
  setDbState,
  setError,
  setOnChainState,
} from "@/redux/user.slice";
import Loader from "./Loader";
import { getUserByIdAction } from "@/features/account/actions/getUserById.action";
import { usePathname } from "next/navigation";
import { disableProviderRoute } from "@/data/routes.data";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export default function Providers(props: { children: ReactNode }) {
  const queryClient = new QueryClient();
  useEffect(() => {
    async function init() {
      await sdk.actions.ready();
    }
    init();
  }, []);

  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Provider store={store}>
              <SessionProvider>
                <InitUserInfoProvider>
                  <AuthKitProvider config={{}}>
                    {props.children}
                  </AuthKitProvider>
                </InitUserInfoProvider>
              </SessionProvider>
            </Provider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </MiniKitProvider>
  );
}

function InitUserInfoProvider({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(false);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const { data: session, status } = useSession();

  const { id } = session?.user || {};
  const [isInitError, setIsInitError] = useState({
    isWalletMismatch: false,
    isOnChainError: false,
    isDbError: false,
    isAuthError: false,
  });
  const [walletAddress, setWalletAddress] = useState<string>();
  const { address, isConnecting, isReconnecting } = useAccount();
  const dispatch = useAppDispatch();
  const { isUserOnChain, isError, isLoading, isUserPremium } =
    useIsAddressOnChainAndPremium({
      address: walletAddress,
    });

  const pathname = usePathname();
  const disableInit = disableProviderRoute.includes(pathname);

  useEffect(() => {
    if (!disableInit) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [disableInit]);

  /**
   * Setting user information from the database
   */
  useEffect(() => {
    if (disableInit) {
      dispatch(resetUser());
      setWalletAddress(undefined);
      return;
    }
    if (status === "loading" || isConnecting || isReconnecting) {
      return;
    }
    if (!id || !address) {
      setIsInitError((prev) => ({ ...prev, isAuthError: true }));
      dispatch(resetUser());
      return;
    }

    async function init() {
      if (!id || !address) return;

      try {
        setIsFetchingUserData(true);
        const user = await getUserByIdAction(id);

        if (!user) {
          setIsInitError((prev) => ({
            ...prev,
            isAuthError: true,
          }));
          return;
        }
        const {
          walletAddress,
          fid,
          isUuidApprove,
          signerUuid,
          username,
          pfpUrl,
          role,
        } = user;

        setIsInitError((prev) => ({
          ...prev,
          isAuthError: false,
          isDbError: false,
          isWalletMismatch: address !== walletAddress,
        }));

        setWalletAddress(walletAddress);
        dispatch(
          setDbState({
            walletAddress,
            id,
            fid,
            isUuidApprove: !!isUuidApprove,
            profilePic: pfpUrl,
            signerUuid,
            username,
            role,
          }),
        );
      } catch {
        setIsInitError((prev) => ({
          ...prev,
          isDbError: true,
        }));
      } finally {
        setIsFetchingUserData(false);
      }
    }

    init();

    return () => {
      dispatch(resetUser());
      setWalletAddress(undefined);
    };
  }, [
    disableInit,
    id,
    status,
    address,
    isConnecting,
    isReconnecting,
    dispatch,
  ]);

  /**
   * Setting user information from the blockchain
   */
  useEffect(() => {
    if (disableInit) {
      dispatch(resetUser());
      return;
    }

    if (isError) {
      setIsInitError((prev) => ({
        ...prev,
        isOnChainError: true,
      }));
      dispatch(resetOnChainState());
      return;
    }

    /**
     * TODO: Set plus information
     */

    dispatch(
      setOnChainState({
        isUserOnChain: !!isUserOnChain,
        isUserPremium: !!isUserPremium,
        isUserPlus: false,
      }),
    );
    setIsInitError((prev) => ({
      ...prev,
      isDbError: false,
    }));

    return () => {
      dispatch(resetOnChainState());
    };
  }, [isUserOnChain, isUserPremium, isError, disableInit, dispatch]);

  /**
   * Setting error in store
   */
  useEffect(() => {
    const { isAuthError, isDbError, isOnChainError, isWalletMismatch } =
      isInitError;
    dispatch(
      setError({
        isError: isAuthError || isDbError || isOnChainError || isWalletMismatch,
        message: "Something went wrong",
      }),
    );
  }, [isInitError, dispatch]);

  return (
    <>
      {showLoader && (
        <Loader
          isLoading={
            !disableInit &&
            (isLoading ||
              status === "loading" ||
              isFetchingUserData ||
              isConnecting ||
              isReconnecting)
          }
        />
      )}

      {children}
    </>
  );
}
