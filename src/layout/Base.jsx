import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Base = ({ children }) => {
  return (
    <div className="app-root">
      <Navbar />
      <main className="page-wrapper">{children}</main>
      <Footer />
    </div>
  );
};

export default Base;
