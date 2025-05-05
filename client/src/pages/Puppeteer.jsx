import React, { useState } from "react";
import { PupProductContainer, Loading, FormInput } from "../components";
import { Form } from "react-router-dom";

const Puppeteer = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/products/pup?search=${encodeURIComponent(
          query
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setError("");
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <Form
          onSubmit={handleSubmit}
          className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4  gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 items-center"
        >
          {/* SEARCH */}
          <FormInput
            type="text"
            label="search for anything"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="input-sm"
          />
          <div className="sm:grid place-self-strech">
            <button type="submit" className="btn btn-primary btn-block ">
              search
            </button>
          </div>
        </Form>
        {isLoading ? <Loading /> : <PupProductContainer products={products} />}
      </div>
    </>
  );
};

export default Puppeteer;
