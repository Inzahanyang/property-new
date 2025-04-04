"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

const markMessageAsRead = async (messageId: string) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("Unauthorized");
  }

  const userId = sessionUser.userId;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }
  if (message.recipient.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  message.read = !message.read;

  revalidatePath("/messages", "page");

  await message.save();

  return message.read;
};

export default markMessageAsRead;
