import Pagination from "@/components/Pagination";
import PropertyCard from "@/components/PropertyCard";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializableObject } from "@/utils/convertToObject";

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const PropertiesPage = async ({ searchParams }: PageProps) => {
  // 올바른 기본값 처리와 함께 구조 분해 할당

  const params = await searchParams;

  const currentPage = Number(params.page || 1);
  const itemsPerPage = Number(params.pageSize || 6);

  await connectDB();

  const skip = (currentPage - 1) * itemsPerPage;

  const total = await Property.countDocuments({});

  const propertiesDocs = await Property.find({})
    .skip(skip)
    .limit(itemsPerPage)
    .lean();
  const properties = propertiesDocs.map(convertToSerializableObject);

  const showPagination = total > itemsPerPage;

  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>No Properties found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              // @ts-ignore
              <PropertyCard key={property._id} {...property} />
            ))}
          </div>
        )}
        {showPagination && (
          <Pagination
            page={currentPage}
            pageSize={itemsPerPage}
            totalItems={total}
          />
        )}
      </div>
    </section>
  );
};

export default PropertiesPage;
