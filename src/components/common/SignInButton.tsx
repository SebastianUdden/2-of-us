import { ui, uiConfig } from "../../config/firebaseUI";
import { useEffect, useRef } from "react";

import { useAuth } from "../../context/AuthContext";

const SignInButton = () => {
  const { user, logout } = useAuth();
  const elementRef = useRef<HTMLDivElement>(null);
  const uiInstanceRef = useRef<firebaseui.auth.AuthUI | null>(null);

  useEffect(() => {
    if (elementRef.current && !user && !uiInstanceRef.current) {
      // Only initialize if we haven't already
      uiInstanceRef.current = ui;
      ui.start(elementRef.current, uiConfig);
    }

    return () => {
      // Cleanup when component unmounts or user changes
      if (uiInstanceRef.current) {
        uiInstanceRef.current.reset();
        uiInstanceRef.current = null;
      }
    };
  }, [user]);

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <img
          src={user.photoURL || ""}
          alt={user.displayName || "User"}
          className="w-8 h-8 rounded-full"
        />
        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return <div ref={elementRef} />;
};

export default SignInButton;
