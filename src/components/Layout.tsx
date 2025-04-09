import Body from "./Body";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col w-[100vw] overflow-x-hidden">
      <Body />
      <Footer />
    </div>
  );
};

export default Layout;
