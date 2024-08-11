"use client";

import { FaGoogle } from "react-icons/fa";

export const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 transition-all"
    >
      {children}
    </button>
  );
};

export const CTAButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-between max-w-fit transition-all"
    >
      {children ? (
        children
      ) : (
        <>
          <FaGoogle className="text-xl mr-4" />
          <span>Sign In with Google</span>
        </>
      )}
    </button>
  );
};

export const TabButton = ({
  onClick,
  children,
  active,
}: {
  onClick: () => void;
  children: React.ReactNode;
  active: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-white ${
        active ? "bg-blue-600" : "bg-blue-400"
      } hover:bg-blue-600 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-between max-w-fit transition-all`}
    >
      {children}
    </button>
  );
};
