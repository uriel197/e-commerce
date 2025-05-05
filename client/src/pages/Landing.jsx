import { Hero, FeaturedProducts } from "../components";
import { queryFetch } from "../utils";
const url = "/products";

const featuredProductsQuery = {
  queryKey: ["featuredProducts"],
  queryFn: () =>
    queryFetch(url, {
      params: {
        featured: true, // Pass featured=true as a query param
      },
    }),
};

export const loader = (queryClient) => async () => {
  // for testing purposes:
  //   console.log(
  //     "Cache check before fetch:",
  //     queryClient.getQueryData(["featuredProducts"])
  //   ); // Test #2
  //   console.log("Cache state:", queryClient.getQueryState(["featuredProducts"])); // Test #2
  const response = await queryClient.ensureQueryData(featuredProductsQuery);
  const { products } = response;
  return { products };
};

const Landing = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
};

export default Landing;
