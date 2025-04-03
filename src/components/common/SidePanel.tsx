import { useEffect, useState } from "react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const SidePanel = ({ isOpen, onClose, children, title }: SidePanelProps) => {
  const [hidePanel, setHidePanel] = useState(true);

  const handleClose = () => {
    setHidePanel(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setHidePanel(false);
      }, 100);
    } else {
      handleClose();
    }
  }, [isOpen]);

  if (!isOpen && hidePanel) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 transition duration-500 ${
          isOpen ? "bg-black/60" : "bg-black/20"
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[40%] bg-gray-900 shadow-xl transition ${
          hidePanel ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-4">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
