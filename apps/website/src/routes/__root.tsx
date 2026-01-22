import { Devtools } from "@/components/devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Devtools />
    </>
  ),
});
