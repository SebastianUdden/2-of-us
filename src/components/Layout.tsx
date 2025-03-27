import Body from "./Body";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col w-[100vw]">
      <div className="flex-1 flex flex-col ">
        <Body />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
