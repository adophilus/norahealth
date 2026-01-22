import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

export const Devtools = () =>
  import.meta.env.MODE === "development" ? (
    <TanStackDevtools
      config={{
        position: "bottom-right",
      }}
      plugins={[
        {
          name: "Tanstack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  ) : null;
