"use server";

import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

const deleteMessage = async (messageId: string) => {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      throw new Error("Unauthorized");
    }
    const { userId } = sessionUser;
    const message = await Message.findById(messageId);

    if (!message) throw new Error("Message Not Found");

    if (message.recipient.toString() !== userId)
      throw new Error("Unauthorized");
    await message.deleteOne();

    revalidatePath("/", "layout");
  } catch (error) {
    console.log(`Failed to delete message: ${error}`);
    throw new Error("Failed to delete message");
  }
};

export default deleteMessage;
