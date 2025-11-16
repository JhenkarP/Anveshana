import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const routes = ["home", "translate", "conversation", "globalchat", "about"];

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="h-12 w-12 rounded-lg object-cover border border-gray-700"
          />
          <span className="font-bold text-lg sm:text-xl">Lingua Bridge</span>
        </div>

        {/* Desktop navbar (same flex as original) */}
        <nav className="hidden md:flex space-x-6 text-base">
          {routes.map((path) => (
            <NavLink
              key={path}
              to={`/${path}`}
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-400"
                }`
              }
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-800 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <nav className="md:hidden bg-gray-800 px-6 pb-4 pt-2 space-y-4 text-lg rounded-b-lg shadow-lg">
          {routes.map((path) => (
            <NavLink
              key={path}
              to={`/${path}`}
              onClick={() => setIsOpen(false)}
              className="block hover:text-blue-400 transition"
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;
