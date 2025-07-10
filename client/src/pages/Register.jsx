import { FormInput, SubmitBtn } from "../components";
import { Form, Link, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Validate required fields
  if (!data.name || !data.email || !data.password) {
    toast.warning("you must fill out all fields");
    return { message: "All fields are required" };
  }

  try {
    const response = await customFetch("/auth/register", {
      method: "POST",
      body: data,
    });
    const fetchedData = await response.json();
    if (fetchedData.user) {
      toast.success("account created successfully");
    } else {
      console.error("error: ", fetchedData);
      throw new Error(response.msg || "Registration failed");
    }
    return redirect("/login");
  } catch (error) {
    const errorMessage = error.message || "Registration failed";
    toast.error(errorMessage);
    return null;
  }
};

const Register = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>
        <FormInput type="text" label="name" name="name" />
        <FormInput type="email" label="email" name="email" />
        <FormInput type="password" label="password" name="password" />
        <div className="mt-4">
          <SubmitBtn text="register" />
        </div>
        <p className="text-center">
          Already a member?
          <Link
            to="/login"
            className="ml-2 link link-hover link-primary capitalize"
          >
            login
          </Link>
        </p>
      </Form>
    </section>
  );
};

export default Register;
