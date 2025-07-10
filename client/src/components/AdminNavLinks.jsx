import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { adminSublinks } from "../data";
import { useGlobalContext } from "../context/GlobalContext";

const AdminNavLinks = () => {
  const theme = useSelector((state) => state.userState.theme);
  const user = useSelector((state) => state.userState.user);
  const { setPageId } = useGlobalContext();

  return (
    <div className="nav-links">
      {adminSublinks.map((link) => {
        const { page, pageId, links } = link;
        return (
          <div className="dropdown" key={pageId}>
            <div className="nav-link" onMouseEnter={() => setPageId(pageId)}>
              {page}
            </div>
            <div
              className="dropdown-menu"
              style={
                theme === "dracula"
                  ? { backgroundColor: "rgb(35, 37, 48)" }
                  : { backgroundColor: "rgb(239, 233, 233)" }
              }
            >
              {links.map((link) => {
                const { id, url, label } = link;
                return (
                  <li key={id}>
                    <NavLink to={url}>{label}</NavLink>
                  </li>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminNavLinks;
