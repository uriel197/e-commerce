import React, { useState } from "react";
import { customFetch } from "../utils";
import { FormInput, FormCheckbox, UploadImage, SubmitBtn } from "../components";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: null,
    description: "",
    company: "",
    category: "",
    featured: false,
    shipping: false,
  });
  const [productId, setProductId] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    // Since we're dealing with a file, we don't use the value but the file itself
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const updateProduct = async (event) => {
    event.preventDefault();

    let updatedData = { ...formData };

    // Handle image upload if an image has been selected
    if (formData.image) {
      const imageUrl = await UploadImage(formData.image); // Ensure uploadImage accepts a file object
      if (!imageUrl) {
        toast.error("Failed to upload image. Product not updated.");
        return;
      }

      updatedData.image = imageUrl;
    }

    // Filter out empty fields
    updatedData = Object.fromEntries(
      Object.entries(updatedData).filter(([key, value]) => {
        return value !== "" && value !== false && value !== null;
      })
    );
    if (!productId) {
      toast.warning("You must enter a product id");
      return;
    }
    try {
      const response = await customFetch(`/products/${productId}`, {
        method: "PATCH",
        body: updatedData,
      });

      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-10">
        Note:
        <span className="text-sm ml-5">
          Fill out Only the fields you want to change!
        </span>
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center">
        <h3 className="text-4xl font-bold leading-none tracking-tight mt-10 sm:text-4xl">
          Update product
        </h3>
      </div>
      <section className="h-screen grid place-items-center mt-5">
        <form
          className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
          onSubmit={updateProduct}
          id="update-product-form"
        >
          <FormInput
            type="text"
            label="Product ID"
            name="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Product ID"
          />
          <FormInput
            type="text"
            label="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <FormInput
            type="number"
            label="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
          <FormInput
            type="text"
            label="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          />
          <FormInput
            type="text"
            label="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
          />
          <FormInput
            type="text"
            label="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <FormInput
            type="file"
            label="Upload image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
          <div className="self-start justify-self-start">
            <FormCheckbox
              name="featured"
              type="checkbox"
              checked={formData.featured}
              label="featured"
              size="checkbox-lg"
              onChange={handleCheckboxChange}
              defaultValue={formData.featured}
            />
            <FormCheckbox
              name="shipping"
              type="checkbox"
              checked={formData.shipping}
              label="shipping"
              size="checkbox-lg"
              onChange={handleCheckboxChange}
              defaultValue={formData.shipping}
            />
          </div>
          <div className="mt-4">
            <SubmitBtn text="Update Product" />
          </div>
        </form>
      </section>
    </>
  );
};

export default UpdateProduct;
