import { FormInput, SubmitBtn } from "../components";
import { Form, Link, redirect, useActionData } from "react-router-dom";
import { useEffect } from "react";
import { customFetch } from "../utils";
import { toast } from "react-toastify";
import { loginUser } from "../features/user/userSlice";

export const action =
  (store) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // Validate required fields
    if (!data.email || !data.password) {
      toast.warning("you must fill out all fields");
      return { message: "All fields are required" };
    }

    try {
      const response = await customFetch("/auth/login", {
        method: "POST",
        body: data,
      });

      if (response.user) {
        store.dispatch(loginUser(response.user)); // Assuming 'user' is directly in the response
      } else {
        console.error("User data not found in response:", response);
        throw new Error(response.msg || "login failed");
      }
      toast.success("logged in successfully");
      return redirect("/");
    } catch (error) {
      console.error("error: ", error.message, {
        status: error.cause?.status,
      });
      const errorMessage = error.message || "Unable to login";
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

const Login = () => {
  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        action="/login"
        className="card w-96  p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
        <FormInput type="email" label="email" name="email" />
        <FormInput type="password" label="password" name="password" />
        <div className="mt-4">
          <SubmitBtn text="login" />
        </div>
        <p className="text-center">
          Not a member yet?{" "}
          <Link
            to="/register"
            className="ml-2 link link-hover link-primary capitalize"
          >
            register
          </Link>
        </p>
      </Form>
    </section>
  );
};

export default Login;
