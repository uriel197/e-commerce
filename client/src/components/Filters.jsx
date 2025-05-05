import { Form, useLoaderData, Link } from "react-router-dom";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormRange from "./FormRange";
import FormCheckbox from "./FormCheckbox";
const Filters = () => {
  const { params } = useLoaderData();
  const { name, company, category, shipping, sort, price } = params;
  const companyOptions = ["all", "ikea", "canada-goose", "marcos"];
  const categoryOptions = [
    "all",
    "travel",
    "furniture",
    "bedroom",
    "clothing",
    "shoes",
  ];

  return (
    <Form className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4  gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
      {/* SEARCH */}
      <FormInput
        type="search"
        label="search product"
        name="name"
        size="input-sm"
        defaultValue={name}
      />
      {/* CATEGORIES */}
      <FormSelect
        label="select category"
        name="category"
        list={categoryOptions}
        size="select-sm"
        defaultValue={category}
      />
      {/* COMPANIES */}
      <FormSelect
        label="select company"
        name="company"
        list={companyOptions}
        size="select-sm"
        defaultValue={company}
      />
      {/* ORDER */}
      <FormSelect
        label="sort by"
        name="sort"
        list={["high", "low"]}
        size="select-sm"
        defaultValue={sort}
      />
      {/* PRICE */}
      <FormRange
        name="price"
        label="select price"
        size="range-sm"
        price={price}
      />
      {/* SHIPPING */}
      <FormCheckbox
        name="shipping"
        label="free shipping"
        size="checkbox-sm"
        defaultValue={shipping}
      />
      {/* BUTTONS */}
      <button type="submit" className="btn btn-primary btn-sm">
        search
      </button>
      <Link to="/products" className="btn btn-accent btn-sm">
        reset
      </Link>
    </Form>
  );
};

export default Filters;
