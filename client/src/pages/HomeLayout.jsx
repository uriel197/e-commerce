import { Outlet, useNavigation } from "react-router-dom";
import { Header, Navbar, Loading, Sidebar } from "../components";

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
