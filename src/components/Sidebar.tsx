// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHome, faEye, faPlusCircle, faUser, faSignOutAlt, faArrowUp, faExchangeAlt, faRightLeft } from '@fortawesome/free-solid-svg-icons';
// import { Link, useNavigate } from 'react-router-dom';
// import { Tooltip as ReactTooltip } from 'react-tooltip'
// import 'react-tooltip/dist/react-tooltip.css'
// import { toast } from 'react-toastify';

// const Sidebar = () => {

//   const navigate = useNavigate()

//   const [loggedIn, setLoggedIn] = useState(false);
//   const [role, setRole] = useState("");

//   useEffect(() => {
//     const loginData = localStorage.getItem("loginData");
//     if (loginData) {
//       setLoggedIn(true);
//       const parsedData = JSON.parse(loginData);
//       const{role}=parsedData
//       console.log(role)
//       setRole(role);

//     }
//   }, []);

//   return (

//       <nav className="bg-blue-500 h-full w-[7%] p-4 fixed flex flex-col items-center">
//         <h1 className="text-white text-2xl font-bold mb-6">67</h1>
//         <ul className="flex-1 space-y-4">
//           <li>
//             <Link to="/" data-tooltip-id='sidebar-tip' data-tooltip-content="Home"  className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors">
//               <FontAwesomeIcon icon={faHome} className="h-6 w-6" />
//             </Link>
//           </li>
//           <li>
//             {role === "buyer" && (
//               <Link to="/view-properties" data-tooltip-id='sidebar-tip' data-tooltip-content="View Properties" className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors">
//                 <FontAwesomeIcon icon={faEye} className="h-6 w-6" />
//               </Link>
//             )}
//             {role === "seller" && (
//               <Link to="/my-properties" data-tooltip-id='sidebar-tip' data-tooltip-content="My properties" className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors">
//                 <FontAwesomeIcon icon={faEye} className="h-6 w-6" />
//               </Link>
//             )}
//           </li>
//           <li>
//             {role === "seller" && (
//               <Link to="/post-property" data-tooltip-id='sidebar-tip' data-tooltip-content="Post property" className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors">
//                 <FontAwesomeIcon icon={faPlusCircle} className="h-6 w-6" />
//               </Link>
//             )}
//             {role === "buyer"  && (
//               <Link to="/switch-roles" data-tooltip-id='sidebar-tip' data-tooltip-content="Switch Role" className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors">
//                 <FontAwesomeIcon icon={faRightLeft} className="h-6 w-6" />
//               </Link>
//             )}
//             {role === "seller"  && (
//               <Link to="/switch-roles" data-tooltip-id='sidebar-tip' data-tooltip-content="Switch Role" className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors">
//                 <FontAwesomeIcon icon={faRightLeft} className="h-6 w-6" />
//               </Link>
//             )}
//           </li>
//           <li>{loggedIn&&(

//             <button onClick={()=>{localStorage.removeItem("loginData"); toast.success("Logged out!"); navigate('/login'); window.location.reload()}} data-tooltip-id='sidebar-tip' data-tooltip-content="Log out" className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors">
//               <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6" />
//             </button>
//           )
//             }
//           </li>
//           <li>
//             <Link to="/upgrade" data-tooltip-id='sidebar-tip' data-tooltip-content="Upgrade Plan" className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors">
//               <FontAwesomeIcon icon={faArrowUp} className="h-6 w-6" />
//             </Link>
//           </li>
//         </ul>
//         <ReactTooltip id='sidebar-tip' />
//       </nav>

//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEye,
  faPlusCircle,
  faSignOutAlt,
  faArrowUp,
  faRightLeft,
  faSackDollar,
  faCoins
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "react-toastify";
import SwitchRole from "../screens/SwitchRoles.tsx";
import Modal from "./Modal.tsx";
import UpgradePlan from "../screens/UpgradePlan.tsx";

const Sidebar = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleUpgradePlanModal = () => {
    setIsUpgradePlanModalOpen(!isUpgradePlanModalOpen);
  };

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      const { role } = parsedData;
      setLoggedIn(true);
      setRole(role);
    }
    const handleRoleChange = (event) => {
      setRole(event.detail);
    };

    window.addEventListener('roleChanged', handleRoleChange);

    return () => {
      window.removeEventListener('roleChanged', handleRoleChange);
    };
  }, []);

  return (
    <nav className="bg-blue-500 sm:h-full h-auto sm:w-[7%] w-full p-4 fixed flex flex-row sm:flex-col justify-between items-center">
      <h1 className="text-white text-2xl font-bold sm:mb-6">67</h1>
      <ul className="sm:flex-1 flex flex-row  sm:flex-col sm:space-y-4">
        <li>
          <Link
            to="/"
            data-tooltip-id="sidebar-tip"
            data-tooltip-content="Home"
            className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors"
          >
            <FontAwesomeIcon icon={faHome} className="h-6 w-6" />
          </Link>
        </li>
        <li>
          {role === "buyer" && (
            <Link
              to="/view-properties"
              data-tooltip-id="sidebar-tip"
              data-tooltip-content="View Properties"
              className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faEye} className="h-6 w-6" />
            </Link>
          )}
          {role === "seller" && (
            <Link
              to="/my-properties"
              data-tooltip-id="sidebar-tip"
              data-tooltip-content="My Properties"
              className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faEye} className="h-6 w-6" />
            </Link>
          )}
        </li>
        {role === "seller" && (
          <li>
            <Link
              to="/post-property"
              data-tooltip-id="sidebar-tip"
              data-tooltip-content="Post Property"
              className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faPlusCircle} className="h-6 w-6" />
            </Link>
          </li>
        )}
        {role === "buyer" && (
          <li>
            <button
              onClick={toggleModal}
              data-tooltip-id="sidebar-tip"
              data-tooltip-content="Switch Role"
              className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faRightLeft} className="h-6 w-6" />
            </button>
            <Modal
              show={isModalOpen}
              onClose={toggleModal}
              title="Simple Modal"
            >
              <SwitchRole />
            </Modal>
          </li>
        )}
        {role === "seller" && (
          <li>
            <button
              onClick={toggleModal}
              data-tooltip-id="sidebar-tip"
              data-tooltip-content="Switch Role"
              className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faRightLeft} className="h-6 w-6" />
            </button>
            <Modal
              show={isModalOpen}
              onClose={toggleModal}
              title="Simple Modal"
            >
              <SwitchRole />
            </Modal>
          </li>
        )}
        <li>
          {loggedIn && (
            <button
              onClick={() => {
                localStorage.removeItem("loginData");
                toast.success("Logged out!");
                navigate("/login");
                window.location.reload();
              }}
              data-tooltip-id="sidebar-tip"
              data-tooltip-content="Log out"
              className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6" />
            </button>
          )}
        </li>
        {loggedIn && (
        <li>
        <button
            onClick={toggleUpgradePlanModal}
            data-tooltip-id="sidebar-tip"
            data-tooltip-content="Upgrade Plan"
            className="flex items-center text-white hover:bg-blue-400 p-2 rounded transition-colors"
          >
            <FontAwesomeIcon icon={faCoins} className="h-6 w-6" />
          </button>
          <Modal
              show={isUpgradePlanModalOpen}
              onClose={toggleUpgradePlanModal}
              title="Upgrade Plan Modal"
            >
              <UpgradePlan />
            </Modal>
        </li>
        )}
      </ul>
      <ReactTooltip id="sidebar-tip" />
    </nav>
  );
};

export default Sidebar;
