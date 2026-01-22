"use client";

import { nora-healthUserManagementAbi } from "@/constants/abis";
import { nora-healthUserManagementContractAddress } from "@/constants/contractAddresses";
import { readContract } from "@wagmi/core";
import { useEffect, useState, useCallback } from "react";
import { wagmiConfig } from "@/config";

export default function useIsAddressOnChainAndPremium({
  address,
}: {
  address?: string;
}) {
  const [isUserOnChain, setIsUserOnChain] = useState<boolean | null>(null);
  const [isUserPremium, setIsUserPremium] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!address) {
        setIsUserOnChain(null);
        setIsUserPremium(null);
        setIsLoading(false);
        setIsError(false);
        return;
      }

      setIsLoading(true);
      setIsError(false);

      try {
        const [registered, premium] = await Promise.all([
          readContract(wagmiConfig, {
            address: nora-healthUserManagementContractAddress,
            abi: nora-healthUserManagementAbi,
            functionName: "getIsUserRegistered",
            args: [address],
          }),
          readContract(wagmiConfig, {
            address: nora-healthUserManagementContractAddress,
            abi: nora-healthUserManagementAbi,
            functionName: "getIsUserPremium",
            args: [address],
          }),
        ]);

        setIsUserOnChain(Boolean(registered));
        setIsUserPremium(Boolean(premium));
      } catch (err) {
        console.error("Contract read error:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserStatus();
  }, [address]);

  return {
    isUserOnChain,
    isUserPremium,
    isUserOnChainAndPremium: !!(isUserOnChain && isUserPremium),
    isLoading,
    isError,
  };
}
