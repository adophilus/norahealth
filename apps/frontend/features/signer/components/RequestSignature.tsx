"use client";

import ButtonAction from "@/components/ButtonAction";
import React, { useEffect, useState, useTransition } from "react";
import { checkSignerStatus, createAndRegisterSigner } from "../actions";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import RequestSignatureQrModal from "./RequestSignatureQrModal";
import { useAppDispatch } from "@/utils";
import { setUuidApprove } from "@/redux/user.slice";

type RequestSignatureProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RequestSignature({
  setIsModalOpen,
}: RequestSignatureProps) {
  const [deeplinkUrl, setDeeplinkUrl] = useState<string>();
  const [signerUuid, setSignerUuid] = useState<string>();
  const [isPolling, setIsPolling] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleRequestSigner = () => {
    startTransition(async () => {
      const res = await createAndRegisterSigner();
      if ("error" in res) {
        toast.error(res.error);
        return;
      }

      setDeeplinkUrl(res.signerApprovalUrl);
      setSignerUuid(res.signerUuid);
      setIsQrModalOpen(true);
      setIsPolling(true);
      toast.success(res.success);
    });
  };

  useEffect(() => {
    if (!signerUuid || !isPolling) return;

    let isApproved = false;

    const id = setInterval(async () => {
      const res = await checkSignerStatus(signerUuid);

      if (res.error) {
        console.log(res.error);
        return;
      }

      const { status } = res;
      if (status === "revoked") {
        clearInterval(id);
        setIsPolling(false);
        setIsQrModalOpen(false);
        toast.error("Signer has been revoked");
        return;
      }

      if (status === "approved") {
        setIsPolling(false);
        setIsQrModalOpen(false);
        clearInterval(id);
        if (isApproved) return;
        toast.success("Signer has been approved");
        isApproved = true;
        dispatch(setUuidApprove(true));
        setIsModalOpen(false);
        return;
      }
    }, 2000);

    return () => {
      clearInterval(id);
    };
  }, [isPolling, signerUuid, setIsModalOpen, dispatch]);

  return (
    <section className="w-full">
      <ButtonAction
        btnType="primary"
        disabled={isPending}
        onClick={() => handleRequestSigner()}
      >
        {isPending ? "Fetching link..." : "Request Signature"}
      </ButtonAction>

      <Loader isLoading={isPending} />
      <RequestSignatureQrModal
        deeplinkUrl={deeplinkUrl}
        isModalOpen={isQrModalOpen}
        setIsModalOpen={setIsQrModalOpen}
      />
    </section>
  );
}
