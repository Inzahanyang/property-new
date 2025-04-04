import { PropertyCardProps } from "@/types";
import Image from "next/image";

interface PropertyImagesProps {
  images: PropertyCardProps["images"];
}

const PropertyImages = ({ images }: PropertyImagesProps) => {
  return (
    <section className="bg-blue-50 p-4">
      <div className="container mx-auto">
        {images.length === 1 ? (
          <Image
            src={images[0]}
            alt="Property Image"
            width={1800}
            priority={true}
            height={400}
            className="object-cover h-[400px] mx-auto rounded-xl"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`${
                  images.length === 3 && index === 2
                    ? "col-span-2"
                    : "col-span-1"
                }`}
              >
                <Image
                  src={image}
                  alt="Property Image"
                  width={1800}
                  height={400}
                  priority={true}
                  className="object-cover h-[400px] w-full rounded-xl"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyImages;
