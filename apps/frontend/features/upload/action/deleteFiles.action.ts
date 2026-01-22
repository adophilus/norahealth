"use server";

import { auth } from "@/auth";
import deleteFiles from "@/features/upload/utils/function/deleteFiles";

export async function deleteFilesAction(ids: string[]) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "Unauthorized" };
    }

    const unpin = await deleteFiles(ids);
    return unpin;
  } catch (error) {
    console.log(error);
    return { error: "Error deleting files" };
  }
}
