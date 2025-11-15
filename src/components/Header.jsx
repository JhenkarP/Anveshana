import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="h-13 w-13 mr-4 rounded-lg"
          />
          <span className="font-bold text-xl">Lingua Bridge</span>
        </div>

        <nav className="hidden md:flex space-x-6">
          {[
            "home",
            "translate",
            "conversation",
            "globalchat",
            "worldmap",
            "about",
          ].map((path) => (
            <NavLink
              key={path}
              to={`/${path}`}
              className={({ isActive }) =>
                isActive ? "text-blue-400 font-semibold" : "hover:text-blue-400"
              }
            >
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </NavLink>
          ))}
        </nav>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav className="md:hidden bg-gray-800 px-4 pb-4 space-y-9 ml-4">
          {["home", "translate", "conversation", "chat", "about"].map(
            (path) => (
              <NavLink
                key={path}
                to={`/${path}`}
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-400"
              >
                {path.charAt(0).toUpperCase() + path.slice(1)}
              </NavLink>
            )
          )}
        </nav>
      )}
    </header>
  );
}

export default Header;
