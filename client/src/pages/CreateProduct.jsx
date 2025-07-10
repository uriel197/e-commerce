import React, { useState } from "react";
import { FormInput, FormCheckbox, SubmitBtn, UploadImage } from "../components";
import { toast } from "react-toastify";
import { customFetch } from "../utils";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    company: "",
    featured: false,
    description: "",
    image: null, // Note: we're storing the file object itself here
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageChange = (e) => {
    // Since we're dealing with a file, we don't use the value but the file itself
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.company ||
      !formData.description ||
      !formData.image
    ) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      // Upload image and get the URL
      const imageUrl = await UploadImage(formData.image); // Ensure uploadImage accepts a file object

      if (!imageUrl) {
        toast.error("Failed to upload image. Product not created.");
        return;
      }
      const response = await customFetch("/products", {
        method: "POST",
        body: {
          ...formData,
          image: imageUrl,
        },
      });
      console.log("formData-image: ", formData.image);

      toast.success("Product created successfully!");

      // Reset form
      setFormData({
        name: "",
        price: "",
        category: "",
        company: "",
        featured: false,
        description: "",
        image: null,
      });
    } catch (error) {
      toast.error(error.message || "Network error occurred");
      console.log("error: ", error.message, error.cause.status);
    }
  };

  return (
    <section className="h-screen grid place-items-center mt-5">
      <form
        onSubmit={handleSubmit}
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Create a product</h4>
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
        </div>
        <div className="mt-4">
          <SubmitBtn text="Create Product" />
        </div>
      </form>
    </section>
  );
};

export default CreateProduct;
