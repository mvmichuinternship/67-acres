import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEye, faPlusCircle, faUser, faSignOutAlt, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate()

  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      setLoggedIn(true);
      const parsedData = JSON.parse(loginData);
      setRole(parsedData?.role);
      
    }
  }, []);
  useEffect(() => {
   console.log(role)
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loginData")
    window.location.reload()
  };

  return (
    // <div className="ml-[6%] min-h-screen w-full ">
    (!loggedIn &&(
    <nav className="bg-gray-800 p-4 w-full z-50">
    <div className="  flex justify-between items-center">
      <Link to="/" className="text-white text-2xl font-bold">RealEstateApp</Link>
      <div>
        {loggedIn ? (
          <button onClick={handleLogout} className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-700">Signout</button>
        ) : (
          <>
            <Link to="/login" className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700 mr-2">Login</Link>
            <Link to="/register" className="text-white bg-green-500 px-4 py-2 rounded hover:bg-green-700">Signup</Link>
          </>
        )}
      </div>
    </div>
  </nav>))
    // </div>
  );
};

export default Navbar;
