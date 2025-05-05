import { customFetch } from "../utils";

const UploadImage = async (file) => {
  if (!file) {
    throw new Error("Please select an image to upload.");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      "http://localhost:5000/api/v1/products/uploadImage",
      {
        method: "POST",
        body: formData,
        credentials: "include", // For cookies
      }
    );

    const data = await response.json();
    console.log("response.json:", data.image);

    // if (!response.image) {
    //   throw new Error(response.msg || "Image upload failed");
    // }

    return data.image;
  } catch (error) {
    // Instead of directly handling UI, we're just throwing the error for the caller to handle
    throw error;
  }
};

export default UploadImage;
