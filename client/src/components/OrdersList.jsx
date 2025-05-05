import { useLoaderData } from "react-router-dom";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { formatPrice } from "../utils";
day.extend(advancedFormat);

const OrdersList = () => {
  const orders = useLoaderData();

  return (
    <div className="mt-8">
      {/* <h4 className="mb-4 capitalize">
        total orders : {meta.pagination.total}
      </h4> */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>User ID</th>
              <th>Status</th>
              <th>Products</th>
              <th>Cost</th>
              <th className="hidden sm:block">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const id = order.id;
              const { user, status, orderItems, total, createdAt } = order;
              const orderTotal = formatPrice(total);
              const items = orderItems.length;
              const date = day(createdAt).format("hh:mm a - MMM Do, YYYY");
              return (
                <tr key={id}>
                  <td>{user}</td>
                  <td>{status}</td>
                  <td>
                    {items} {orderItems.length > 1 ? "items" : "item"}
                  </td>
                  <td>{orderTotal}</td>
                  <td className="hidden sm:block">{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;
