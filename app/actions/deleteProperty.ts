"use server";

import cloudinary from "@/config/cloudinary";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

const deleteProperty = async (propertyId: string) => {
  try {
    // Get session user
    const sessionUser = await getSessionUser();
    // If user is not logged in, throw an error
    if (!sessionUser || !sessionUser.userId) {
      throw new Error("Unauthorized");
    }
    // Get user ID
    const { userId } = sessionUser;
    // Find property by ID
    const property = await Property.findById(propertyId);
    // If property is not found, throw an error
    if (!property) throw new Error("Property Not Found");

    // Verify ownership
    if (property.owner.toString() !== userId) throw new Error("Unauthorized");

    // Extract public ID from image URL
    const publicIds = property.images.map(
      (imageUrl: string) => imageUrl.split("/").at(-1)?.split(".")[0]
    );

    // Delete images from Cloudinary
    if (publicIds.length > 0) {
      for (let publicId of publicIds) {
        await cloudinary.uploader.destroy(`propertypulse/${publicId}`);
      }
    }

    // Delete property from database
    await property.deleteOne();

    // Revalidate the page
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(`Failed to delete property: ${error}`);
    throw new Error("Failed to delete property");
  }
};

export default deleteProperty;
