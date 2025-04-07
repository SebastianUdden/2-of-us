import BackupPanel from "./common/BackupPanel";
import SidePanel from "./common/SidePanel";
import SignInButton from "./common/SignInButton";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
/* import { useStorage } from "../context/StorageContext"; */

const Footer = () => {
  /* const { storageType, setStorageType } = useStorage(); */
  const { user } = useAuth();
  const [isBackupPanelOpen, setIsBackupPanelOpen] = useState(false);

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
        <div className="flex items-center space-x-4">
          {user && <p className="text-sm text-gray-300">{user.email}</p>}
          <button
            onClick={() => setIsBackupPanelOpen(true)}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Data Backup
          </button>
        </div>
        <SignInButton />
        {/* </div> */}
        {/* )} */}
      </div>

      <SidePanel
        isOpen={isBackupPanelOpen}
        onClose={() => setIsBackupPanelOpen(false)}
        title="Data Backup"
      >
        <BackupPanel onClose={() => setIsBackupPanelOpen(false)} />
      </SidePanel>
    </footer>
  );
};

export default Footer;
