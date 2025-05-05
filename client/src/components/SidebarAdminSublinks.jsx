import { adminSublinks } from "../data";

const SidebarAdminSublinks = () => {
  return (
    <div className="sidebar-links">
      {adminSublinks.map((link) => {
        const { pageId, page, links } = link;
        return (
          <article key={pageId}>
            <h2 className="text-xl">{page}</h2>
            <div className="sidebar-sublinks">
              {links.map((link) => {
                const { id, label, icon, url } = link;
                return (
                  <a href={url} key={id}>
                    {icon}
                    {label}
                  </a>
                );
              })}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default SidebarAdminSublinks;
