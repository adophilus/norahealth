import { auth } from "@/auth";
import { Participants } from "@/features/campaign/components";
import { ComposeDirectCast } from "@/features/direct-cast/components";
import {
  BroadcastEmail,
  BroadcastEmailToCinematicStreak,
} from "@/features/mail/components";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <main className="text-black p-4 flex items-start justify-start flex-col w-full gap-4">
      <Participants />
      <BroadcastEmailToCinematicStreak />
      <BroadcastEmail />
      <ComposeDirectCast />
    </main>
  );
}
