import { Link, useLoaderData } from "react-router-dom";
import { formatPrice } from "../utils";
import SectionTitle from "./SectionTitle";

const FeaturedProducts = () => {
  const { products } = useLoaderData();

  // Log the data from useLoaderData to verify it’s served from cache

  return (
    <>
      <SectionTitle text="featured products" />
      <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const { name, price, image, id, description } = product;
          const dollarsAmount = formatPrice(price);
          return (
            <Link
              key={id}
              to={`/products/${id}`}
              className="card w-full shadow-xl hover:shadow-2xl transition duration-300"
            >
              <figure className="px-4 pt-4">
                <img
                  src={image}
                  alt={name}
                  className="rounded-xl h-64 md:h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-name capitalize tracking-wider">{name}</h2>
                <p>Description: {description}</p>
                <span className="text-secondary">{dollarsAmount}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default FeaturedProducts;
