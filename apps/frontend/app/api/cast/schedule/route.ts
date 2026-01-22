import { auth } from "@/auth";
import { exceedCastLimit } from "@/features/cast/actions/exceedCastLimit.action";
import { scheduleCastPostSchema } from "@/features/cast/schemas/scheduleCastPost.schema";
import { getUserById } from "@/helpers/read-db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8008";

    const result = await exceedCastLimit();
    console.log("result", result);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { id } = session.user;
    const body = await request.json();
    const parsedData = scheduleCastPostSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        {
          error: parsedData.error.errors[0].message,
        },
        { status: 400 },
      );
    }

    const { channelId, embeds, text, scheduledAt, status, userId } =
      parsedData.data;

    if (!scheduledAt) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    if (new Date() > scheduledAt) {
      return NextResponse.json(
        { error: "Date cannot be in the past" },
        { status: 400 },
      );
    }

    if (userId !== id) {
      return NextResponse.json(
        { error: "User not authorized" },
        { status: 403 },
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user?.signerUuid) {
      return NextResponse.json(
        { error: "User does not have a signer" },
        { status: 400 },
      );
    }

    // Call backend to schedule the post
    const backendPayload = {
      signerUuid: user.signerUuid,
      content: text,
      scheduledTime: scheduledAt.toISOString(),
      channelId,
      embeds,
    };

    const backendResponse = await fetch(
      `${BACKEND_API_URL}/Post/schedule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendPayload),
      },
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      console.error("Backend error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to schedule post in backend" },
        { status: backendResponse.status },
      );
    }

    const result = await backendResponse.json();
    return NextResponse.json(
      { message: "Post scheduled successfully", data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Schedule error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
