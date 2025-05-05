import { Filters, ProductsContainer } from "../components";
import { queryFetch } from "../utils";

const url = "/products";

const allProductsQuery = (queryParams) => {
  const { name, category, company, sort, price, shipping } = queryParams;

  return {
    queryKey: [
      "products",
      name ?? "",
      category ?? "all",
      company ?? "all",
      sort ?? "a-z",
      price ?? 100000,
      shipping ?? false,
    ],
    queryFn: () =>
      queryFetch(url, {
        params: queryParams,
      }),
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]); /* 2 */

    // for testing purposes:
    // const queryKey = [
    //   "products",
    //   params.search ?? "",
    //   params.category ?? "all",
    //   params.company ?? "all",
    //   params.sort ?? "a-z",
    //   params.price ?? 100000,
    //   params.shipping ?? false,
    // ];
    // console.log(
    //   "Cache check before fetch:",
    //   queryClient.getQueryData(queryKey)
    // ); // Test #2
    // console.log("Cache state:", queryClient.getQueryState(queryKey)); // Test #2
    // /* 1 */
    const response = await queryClient.ensureQueryData(
      allProductsQuery(params)
    );

    const { products } = response;
    //   const meta = response.meta;
    return { products, params };
  };

const Products = () => {
  return (
    <>
      <Filters />
      <ProductsContainer />
      {/* <PaginationContainer /> */}
    </>
  );
};

export default Products;

/*
=======================================
    COMMENTS - COMMENTS - COMMENTS
=======================================

*** 1: The request object refers to the incoming request made to your React Router loader(request object created by React Router). Example: /products?featured=true, params will be { featured: "true" }. Loader uses request to prepare the API call.
The response object refers to the HTTP response returned by the external API you're fetching data from. You use data from the request object (e.g., query parameters) to configure the API request that generates the response.

*** 2: request.url: The full URL of the current route (e.g., /products?featured=true).This is parsed using new URL(request.url) to extract query parameters (searchParams).
*/
