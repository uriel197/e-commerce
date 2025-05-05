import { nanoid } from "nanoid";

const PupProductsList = ({ products }) => {
  return (
    <div className="mt-12 grid gap-y-8">
      {products.map((product, index) => {
        const { title, price, image, id = nanoid() } = product; // Adjust structure if necessary
        return (
          <div
            key={id}
            className="p-8 rounded-lg flex flex-col sm:flex-row gap-y-4 flex-wrap bg-base-100 shadow-xl hover:shadow-2xl duration-300 group"
          >
            <img
              src={image}
              alt={title}
              className="h-full w-24 rounded-base sm:h-32 sm:w-32 object-contain group-hover:scale-105 transition duration-300"
            />
            <div className="ml-0 sm:ml-16">
              <h3 className="capitalize font-medium text-lg">{title}</h3>
            </div>
            <p className="font-medium ml-0 sm:ml-auto text-lg">
              ${price || "N/A"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PupProductsList;
