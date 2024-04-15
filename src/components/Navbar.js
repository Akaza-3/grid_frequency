import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

function Navbar({ user }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      <div className="md:flex items-center justify-between bg-[#0f0f0f] text-white py-4 md:px-10 px-7">
        <div className="font-bold text-2xl cursor-pointer items-center">
          <Link to="/">
            <h1 className="text-3xl">Home</h1>
          </Link>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          <ion-icon name={open ? "close" : "menu"}></ion-icon>
        </div>
        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-[#0f0f0f]  md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-19" : "top-[-490px]"
          }`}
        >
          <li className="md:ml-8 text-xl md:my-0 my-7 ">
            <Link className="text-white hover:text-gray-400" to="/models">
              Models
            </Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link className="text-white hover:text-gray-400" to="/contact">
              Contact us
            </Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link className="text-white hover:text-gray-400" to="/about">
              About us
            </Link>
          </li>
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link className="text-white hover:text-gray-400" to="/pytopickle">
              Convert file
            </Link>
          </li>
          {user ? (
            <>
              <li className="md:ml-8 text-xl md:my-0 my-7">
                <Link
                  className="text-white hover:text-gray-400"
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li
                className="md:ml-8 text-xl md:my-0 my-7"
                onClick={handleLogout}
              >
                <span className="text-white cursor-pointer hover:text-gray-400">
                  Logout
                </span>
              </li>
            </>
          ) : (
            <li className="md:ml-8 text-xl md:my-0 my-7">
              <Link className="text-white hover:text-gray-400" to="/login">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
