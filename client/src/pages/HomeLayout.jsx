import { Outlet, useNavigation, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../features/user/userSlice";
import { Header, Navbar, Loading, Sidebar } from "../components";

export const loader = (store) => async () => {
  try {
    const response = await fetch("http://localhost:5000/api/v1/users/showMe", {
      method: "GET",
      credentials: "include", // Send signed cookie
    });
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Format is no JSON");
    }
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Handle "No token found" or "Authentication failed"
        store.dispatch(logoutUser());
        toast.error("Session expired. Please log in again.");
        return null;
      }
      throw new Error(data.msg || "Failed to fetch users");
    }
    return data; // Return user data for HomeLayout
  } catch (error) {
    console.error("error: ", error.message);
    store.dispatch(logoutUser());
    toast.error("Session invalid or server error. Please log in again.");
    return redirect("/login");
  }
};

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";
  return (
    <>
      <Header />
      <Navbar />
      {isPageLoading ? (
        <Loading />
      ) : (
        <section className="align-element py-20">
          <Outlet />
        </section>
      )}
      <Sidebar />
    </>
  );
};

export default HomeLayout;
