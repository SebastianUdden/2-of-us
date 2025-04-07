import SignInButton from "./common/SignInButton";
import { useAuth } from "../context/AuthContext";
/* import { useStorage } from "../context/StorageContext"; */

const Footer = () => {
  /* const { storageType, setStorageType } = useStorage(); */
  const { user } = useAuth();
  /* 
  const handleStorageToggle = () => {
    if (storageType === "local") {
      setStorageType("cloud");
    } else {
      setStorageType("local");
    }
  };
 */
  return (
    <footer className="mt-auto bg-gray-800 text-white">
      <div className="flex justify-between items-center container mx-auto px-4 py-6">
        {/* <div className="flex justify-center items-center"> */}
        {/* <div className="flex items-center space-x-2">
            <span className="text-sm">Lokal</span>
            <button
              onClick={handleStorageToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                storageType === "cloud" ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  storageType === "cloud" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm">Moln</span>
          </div> */}
        {/* </div> */}
        {/* {storageType === "cloud" && ( */}
        {/* <div className="flex items-center space-x-4"> */}
        {user && <p className="text-sm text-gray-300">{user.email}</p>}
        <SignInButton />
        {/* </div> */}
        {/* )} */}
      </div>
    </footer>
  );
};

export default Footer;
