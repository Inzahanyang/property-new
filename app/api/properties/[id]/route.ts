import connectDB from "@/config/database";
import Property from "@/models/Property";
import { NextRequest } from "next/server";

interface ParamsProps {
  params: { id: string };
}

export const GET = async (request: NextRequest, { params }: ParamsProps) => {
  try {
    await connectDB();

    const { id } = await params;

    const property = await Property.findById(id);

    if (!property)
      return new Response(JSON.stringify({ message: `${id} is not exist` }));

    return new Response(
      JSON.stringify({
        property,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: `Something is wrong  ${error}` })
    );
  }
};
