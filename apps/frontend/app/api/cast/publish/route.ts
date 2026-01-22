import { auth } from "@/auth";
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

    const { id } = session.user;
    const body = await request.json();
    const parsedData = scheduleCastPostSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        {
          error: parsedData.error.errors?.[0]?.message || "Invalid request",
        },
        { status: 400 },
      );
    }

    const { channelId, embeds, text, userId } = parsedData.data;

    if (!text && !embeds) {
      return NextResponse.json(
        { error: "No text or embeds provided" },
        { status: 400 },
      );
    }

    if (userId !== id) {
      return NextResponse.json(
        { error: "User not authorized" },
        { status: 403 },
      );
    }

    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.signerUuid) {
      return NextResponse.json(
        { error: "User does not have a signer" },
        { status: 400 },
      );
    }

    // Call backend to publish the post immediately
    const backendPayload = {
      signerUuid: user.signerUuid,
      content: text,
      channelId,
      embeds,
    };

    const backendResponse = await fetch(
      `${BACKEND_API_URL}/Post/post`,
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
        { error: error.message || "Failed to publish cast" },
        { status: backendResponse.status },
      );
    }

    const result = await backendResponse.json();
    return NextResponse.json(
      { message: "Cast published successfully", data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

