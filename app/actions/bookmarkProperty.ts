"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

const bookmarkProperty = async (propertyId: string) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("user ID is required");
  }

  const { userId } = sessionUser;

  const user = await User.findById(userId);

  let isBookmarked = user.bookmarks.includes(propertyId);

  let message;

  if (isBookmarked) {
    user.bookmarks.pull(propertyId);
    message = "bookmark removed";
    isBookmarked = false;
  } else {
    user.bookmarks.push(propertyId);
    message = "bookmark added";
    isBookmarked = true;
  }

  await user.save();

  revalidatePath("/properties/saved", "page");

  return {
    message,
    isBookmarked,
  };
};
export default bookmarkProperty;
