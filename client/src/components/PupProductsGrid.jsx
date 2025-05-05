import { Link, useLoaderData } from "react-router-dom";
import { formatPrice } from "../utils";
import { nanoid } from "nanoid";

const PupProductsGrid = ({ products }) => {
  return (
    <div className="pt-15 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => {
        const { title, description, image, price, id = nanoid() } = product;
        //const dollarsAmount = formatPrice(price);
        return (
          <div
            key={id}
            to={`/products/${id}`}
            className="card w-full shadow-xl hover:shadow-2xl transition duration-300"
          >
            <figure className="px-4 pt-4">
              <img
                src={image}
                alt={title}
                className="rounded-base h-64 md:h-48 w-full object-contain"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title capitalize tracking-wider">{title}</h2>
              <p>{description}</p>
              <span className="text-secondary">${price}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PupProductsGrid;
