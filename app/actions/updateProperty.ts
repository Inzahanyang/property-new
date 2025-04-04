"use server";

import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const UpdateProperty = async (propertyId: string, formData: FormData) => {
  // Connect to the database
  await connectDB();

  // Get the session from the login user
  const sessionUser = await getSessionUser();

  // Check session user is valid
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("Unauthorized");
  }
  const { userId } = sessionUser;

  // Get the property from the database
  const existingProperty = await Property.findById(propertyId);

  // Check if the user is the owner of the property
  if (existingProperty.owner.toString() !== userId) {
    throw new Error("You are not the owner of this property");
  }
  // Update the property from form data
  const updatePropertyData = {
    owner: userId,
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zipcode: formData.get("location.zipcode"),
    },
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    square_feet: formData.get("square_feet"),
    amenities: formData.getAll("amenities"),
    rates: {
      nightly: formData.get("rates.nightly"),
      weekly: formData.get("rates.weekly"),
      monthly: formData.get("rates.monthly"),
    },
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },
  };
  // Db update
  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    updatePropertyData
  );
  // revalidate the property immediately
  revalidatePath("/", "layout");
  // redirect to the updated property page
  redirect(`/properties/${updatedProperty._id}`);
};

export default UpdateProperty;
