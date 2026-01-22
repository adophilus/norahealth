"use client";

import { nora-healthUserManagementAbi } from "@/constants/abis";
import { nora-healthUserManagementContractAddress } from "@/constants/contractAddresses";
import { useReadContract } from "wagmi";

export default function useGetPremiumAmount() {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: nora-healthUserManagementContractAddress,
    abi: nora-healthUserManagementAbi,
    functionName: "requiredWeiForPremium",
  });

  const refresh: () => Promise<void> = async () => {
    await Promise.all([refetch()]);
  };

  return {
    amount: data,
    isLoading,
    isError,
    refresh,
  };
}
