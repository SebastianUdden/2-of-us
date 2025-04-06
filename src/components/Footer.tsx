import { useStorage } from "../context/StorageContext";

const Footer = () => {
  const { storageType, setStorageType } = useStorage();

  return (
    <footer className="mt-auto bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© 2024 2-of-us. All rights reserved.</p>
          </div>

          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Lokal</span>
              <button
                onClick={() =>
                  setStorageType(storageType === "local" ? "cloud" : "local")
                }
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
