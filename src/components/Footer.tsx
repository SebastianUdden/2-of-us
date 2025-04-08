import BackupPanel from "./common/BackupPanel";
import SidePanel from "./common/SidePanel";
import SignInButton from "./common/SignInButton";
import { useState } from "react";
/* import { useStorage } from "../context/StorageContext"; */

const Footer = () => {
  const [isBackupPanelOpen, setIsBackupPanelOpen] = useState(false);

  return (
    <footer className="mt-auto bg-gray-800 text-white">
      <div className="flex justify-between items-center container mx-auto px-4 py-6 max-w-screen-lg">
        <button
          onClick={() => setIsBackupPanelOpen(true)}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Data Backup
        </button>
        <SignInButton />
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
