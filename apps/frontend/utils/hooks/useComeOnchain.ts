"use client";

import { nora-healthUserManagementAbi } from "@/constants/abis";
import { nora-healthUserManagementContractAddress } from "@/constants/contractAddresses";
import { setUserIsOnchain } from "@/redux/user.slice";
import { useAppDispatch, useAppSelector } from "@/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";

export default function useComeOnchain() {
  const dispatch = useAppDispatch();
  const { fid, isError, errorStateMent, isUserOnChain } = useAppSelector(
    (state) => state.user,
  );

  const {
    writeContract,
    isPending,
    isSuccess,
    isError: writeError,
  } = useWriteContract();

  const comeOnchain = () => {
    if (isError) {
      toast.error(errorStateMent);
      return;
    }

    if (isUserOnChain) {
      toast.error("You're already onchain");
      return;
    }

    writeContract({
      address: nora-healthUserManagementContractAddress,
      abi: nora-healthUserManagementAbi,
      functionName: "registerUser",
      args: [fid],
    });
  };

  useEffect(() => {
    async function handleSuccess() {
      if (isSuccess) {
        toast.success("You're onchain");
        dispatch(setUserIsOnchain(true));
      }
    }
    handleSuccess();
  }, [isSuccess]);

  useEffect(() => {
    if (writeError) {
      toast.error("Something went wrong");
    }
  }, [writeError]);

  return { comeOnchain, isPending, isSuccess, isError };
}
