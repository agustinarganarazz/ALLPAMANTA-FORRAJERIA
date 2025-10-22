import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <NavBar />}
      <main className="pt-16">{children ? children : <Outlet />}</main>
    </>
  );
};

export default Layout;
