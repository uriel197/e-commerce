import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { useGlobalContext } from "../context/GlobalContext";
import { SidebarSublinks, SidebarAdminSublinks } from "../components";

const Sidebar = () => {
  const theme = useSelector((state) => state.userState.theme);
  const { isSidebarOpen, closeSidebar } = useGlobalContext();
  const user = useSelector((state) => state.userState.user);

  return (
    <aside
      className={isSidebarOpen ? "sidebar show-sidebar" : "sidebar"}
      style={
        theme === "dracula"
          ? { backgroundColor: "rgb(35, 37, 48)", color: "white" }
          : { backgroundColor: "rgb(239, 233, 233)" }
      }
    >
      <div className="sidebar-container">
        <button className="close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>
        {user?.role === "admin" ? (
          <SidebarAdminSublinks />
        ) : (
          <SidebarSublinks />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
