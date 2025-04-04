import PropertyCard from "@/components/PropertyCard";
import connectDB from "@/config/database";
import User from "@/models/User";
import { PropertyCardProps } from "@/types";
import { getSessionUser } from "@/utils/getSessionUser";

const SavedPropertiesPage = async () => {
  connectDB();

  const { userId } = await getSessionUser();

  // @ts-ignore
  const { bookmarks: properties } = await User.findById(userId)
    .populate("bookmarks")
    .lean();

  return (
    <div>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Your Saved Properties</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <!-- Listing 1 --> */}
            {properties.length === 0 ? (
              <p>No Saved Properties</p>
            ) : (
              properties.map((property: PropertyCardProps) => (
                <PropertyCard key={property._id} {...property} />
              ))
            )}
          </div>
        </div>
      </section>
      {/* <!-- Pagination --> */}
      <section className="container mx-auto flex justify-center my-8">
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          {/* <!-- Previous Button --> */}
          <a
            href="#"
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="sr-only">Previous</span>
            {/* <!-- You can use an icon here, for example: <i className="fas fa-chevron-left"></i> --> */}
            Previous
          </a>

          {/* <!-- Page Numbers --> */}
          <a
            href="#"
            className="bg-blue-500 text-white hover:bg-blue-600 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
          >
            1
          </a>
          <a
            href="#"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            2
          </a>
          <a
            href="#"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            3
          </a>

          {/* <!-- Next Button --> */}
          <a
            href="#"
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="sr-only">Next</span>
            {/* <!-- You can use an icon here, for example: <i className="fas fa-chevron-right"></i> --> */}
            Next
          </a>
        </nav>
      </section>
    </div>
  );
};

export default SavedPropertiesPage;
