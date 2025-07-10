import { BsCart3, BsMoonFill, BsSunFill } from "react-icons/bs";
import { FaBarsStaggered } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { NavLinks, AdminNavLinks } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, logoutUser } from "../features/user/userSlice";
import { useGlobalContext } from "../context/GlobalContext";
import Sidebar from "./Sidebar";
import { useCallback } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const Navbar = () => {
  const { openSidebar } = useGlobalContext();
  const dispatch = useDispatch();
  const { user, theme } = useSelector((state) => state.userState);

  const handleTheme = useCallback(
    debounce(async () => {
      const newTheme = theme === "dracula" ? "cupcake" : "dracula";

      dispatch(toggleTheme()); // Update local state and UI immediately
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/users/updateUserTheme",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ theme: newTheme }),
            credentials: "include", // Ensure cookies are sent with the request
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success(`${data.msg}`);
        } else {
          if (response.status === 401) {
            toast.error("Session expired. Please log in again.");
            dispatch(logoutUser());
          } else {
            throw new Error("Failed to update theme");
          }
        }
      } catch (error) {
        console.error("Error updating theme:", error.message);
        toast.error("Failed to save theme preference. Please try again.");
      }
    }, 500),
    [theme, user, dispatch]
  );

  const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart);

  return (
    <nav className="bg-base-200">
      <div className="navbar align-element">
        <div className="navbar-start">
          {/* TITLE */}
          <NavLink
            to="/"
            className="hidden lg:flex btn btn-primary text-3xl items-center"
          >
            E-comm
          </NavLink>
          {/* DROPDOWN */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <button type="button" onClick={openSidebar}>
                <FaBarsStaggered className="h-6 w-6" />
              </button>
            </label>
            <Sidebar />
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal">
            {user?.role === "admin" ? <AdminNavLinks /> : <NavLinks />}
          </ul>
        </div>
        <div className="navbar-end">
          {/* THEME SETUP */}
          <label className="swap swap-rotate">
            <input type="checkbox" onChange={handleTheme} />
            {/* sun icon*/}
            <BsSunFill className="swap-on h-4 w-4" />
            {/* moon icon*/}
            <BsMoonFill className="swap-off h-4 w-4" />
          </label>
          {/* CART LINK */}
          <NavLink to="/cart" className="btn btn-ghost btn-circle btn-md ml-4">
            <div className="indicator">
              <BsCart3 className="h-6 w-6" />
              <span className="badge badge-sm badge-primary indicator-item">
                {numItemsInCart}
              </span>
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
