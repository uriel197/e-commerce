import React, { useState } from "react";
import { Form } from "react-router-dom";
import { FormInput } from "../components";
import { customFetch } from "../utils";
import { toast } from "react-toastify";

const DeleteProduct = () => {
  const [formData, setFormData] = useState({
    productId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ productId: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      const response = await customFetch(`/products/${formData.productId}`, {
        method: "DELETE",
      });

      toast.success("Product deleted successfully!");

      // Reset form
      setFormData({
        productId: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4  gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 items-center"
    >
      {/* SEARCH */}
      <FormInput
        label="Enter product ID"
        type="search"
        name="productId"
        size="input-sm"
        value={formData.productId}
        onChange={handleInputChange}
      />
      {/* BUTTONS */}
      <div className="grid place-self-strech">
        <button
          type="submit"
          disabled={!formData.productId}
          className="btn btn-primary btn-sm"
        >
          Delete
        </button>
      </div>
    </Form>
  );
};

export default DeleteProduct;
