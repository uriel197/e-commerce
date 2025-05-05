import { redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils";
import {
  OrdersList,
  //ComplexPaginationContainer,
  SectionTitle,
} from "../components";

// const ordersQuery = (params, user) => {
//   return {
//     queryKey: [
//       "orders",
//       user.username,
//       params.page ? parseInt(params.page) : 1,
//     ],
//     queryFn: () =>
//       customFetch.get("/orders", {
//         params,
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       }),
//   };
// };

export const loader =
  (store) =>
  async ({ request }) => {
    const user = store.getState().userState.user;

    if (!user) {
      toast.error("You must logged in to view orders");
      return redirect("/login");
    }
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);
    try {
      const response = await customFetch("/orders", {
        params,
      });
      const orders = response.orders;
      console.log("response from sever:", orders);
      return orders;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.error?.message ||
        "there was an error placing your order";
      toast.error(errorMessage);
      if (error?.response?.status === 401 || 403) return redirect("/login");
      return null;
    }
  };

const Orders = () => {
  //   const { meta } = useLoaderData();
  //   if (meta.pagination.total < 1) {
  //     return <SectionTitle text="please make an order" />;
  //   }
  return (
    <>
      <SectionTitle text="Your Orders" />
      <OrdersList />
      {/* <ComplexPaginationContainer /> */}
    </>
  );
};

export default Orders;
