import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
    </div>
  );
};
