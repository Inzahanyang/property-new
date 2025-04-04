import PropertyCard from "@/components/PropertyCard";
import PropertySearchForm from "@/components/PropertySearchForm";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { PropertyCardProps } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";

interface SearchProps {
  searchParams: {
    [key: string]: string | string[];
  };
}
interface QuertyType {
  $or: Array<Record<string, RegExp>>;
  type?: RegExp;
}

const SearchResultsPage = async ({ searchParams }: SearchProps) => {
  await connectDB();
  const { location, propertyType } = await searchParams;
  const locationString = Array.isArray(location) ? location[0] : location;
  const locationPattern = new RegExp(locationString, "i");

  let query: QuertyType = {
    $or: [
      { name: locationPattern },
      { description: locationPattern },
      { "location.street": locationPattern },
      { "location.city": locationPattern },
      { "location.state": locationPattern },
      { "location.zipcode": locationPattern },
    ],
  };

  if (propertyType && propertyType !== "All") {
    const propertyTypeString = Array.isArray(propertyType)
      ? propertyType[0]
      : propertyType;
    const typePattern = new RegExp(propertyTypeString, "i");
    query.type = typePattern;
  }

  const propertiesQueryResults = await Property.find(query).lean();
  const properties = convertToSerializableObject(propertiesQueryResults);

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div>
          <PropertySearchForm />
        </div>
      </section>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <Link
            href="/properties"
            className="flex items-center text-blue-500 hover:underline mb-3"
          >
            <FaArrowAltCircleLeft className="mr-2 mb-1" /> Back To Properties
          </Link>
          <h1 className="text-2xl mb-4">Search Results</h1>

          {properties.length === 0 ? (
            <p>No Search Results</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property: PropertyCardProps) => (
                <PropertyCard key={property._id} {...property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResultsPage;
