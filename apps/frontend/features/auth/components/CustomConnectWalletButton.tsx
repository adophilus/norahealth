import ButtonAction from "@/components/ButtonAction";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type CustomConnectWalletButtonProps = {
  btnType?: "primary" | "secondary";
};
const CustomConnectWalletButton = ({
  btnType,
}: CustomConnectWalletButtonProps) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;

        const connected = ready && account && chain;
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                display: "none",
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <ButtonAction
                    btnType={btnType || "primary"}
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </ButtonAction>
                );
              }
              if (chain.unsupported) {
                return (
                  <ButtonAction
                    btnType={btnType || "primary"}
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </ButtonAction>
                );
              }

              return (
                <ButtonAction
                  btnType={btnType || "primary"}
                  onClick={openAccountModal}
                  type="button"
                >
                  {account.displayName}
                </ButtonAction>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectWalletButton;
