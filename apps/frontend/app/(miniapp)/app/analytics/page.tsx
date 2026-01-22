import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StatusCard from "@/components/StatusCard";
import { Archive, CalendarClock, LucideSend } from "lucide-react";
import React from "react";
import { TbSpeakerphone } from "react-icons/tb";
import { dashboardStats } from "@/helpers/read-db";

export default async function Dashboard() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/login");

  const { id } = session.user;

  const stats = await dashboardStats(id);

  return (
    <main className="text-black p-4 flex items-start justify-start flex-col w-full gap-4">
      <h1 className="font-semibold text-2xl h-fit capitalize">
        Your analytics
      </h1>
      <section className="w-full grid grid-cols-2 gap-4">
        <StatusCard
          Icon={LucideSend}
          value={stats?.publishedCastsCount || 0}
          text="Published casts"
        />
        <StatusCard
          Icon={CalendarClock}
          value={stats?.scheduledCastsCount || 0}
          text="Scheduled casts"
        />
        <StatusCard
          Icon={TbSpeakerphone}
          value={stats?.campaignCount || 0}
          text="Active campaign"
        />
        <StatusCard
          Icon={Archive}
          value={stats?.draftCastsCount || 0}
          text="Drafts"
        />
      </section>
    </main>
  );
}
