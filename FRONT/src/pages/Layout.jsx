import NavBar from "../components/NavBar";


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {/* Padding top de 16 (64px) para compensar el navbar fixed de h-16 */}
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
