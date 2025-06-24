import React from "react";
import { FaHome, FaUser, FaEnvelope } from "react-icons/fa"; 
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const handleNavigation = (page) => {
    toast.success(`Navigating to ${page} Page!`);
  };

  return (
    <div className="flex justify-between items-center  bg-vintageBlue-light/20 w-11/12 max-w-[1160px] py-4 mx-auto">
      <Link to="/" onClick = {() => handleNavigation("Home")}>
        <img src = "/assets/logo.png" height={40} width={100} loading="lazy"  alt="Hawlbook logo" />
      </Link>

      <nav>
        <ul className="flex gap-x-10 text-richblack-500">
          <li>
            <Link to="/" onClick={() => handleNavigation("/")}>
            <h1 className="text-2xl  flex items-center">
            <FaHome className="mr-2" /> Home
            </h1>
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => handleNavigation("dashboard")}>
            <h1 className="text-2xl  flex items-center">
            <FaUser className="mr-1"/>
            Skills & Projects
            </h1></Link>
            
          </li>
          <li>
            <Link to="/contact" onClick={() => handleNavigation("login")}>
            <h1 className="text-2xl flex items-center">
             <FaEnvelope className="mr-1" />
            Contact Me
            </h1></Link>
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default Navbar;


