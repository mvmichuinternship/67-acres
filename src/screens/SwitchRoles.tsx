// import React, { useEffect, useState } from "react";
// import PropertyCard from "../components/Property-card.tsx";
// import { useNavigate } from "react-router-dom";
// import Button from "../components/Button.tsx";
// import { toast } from "react-toastify";

// const SwitchRole = () => {
//   const navigate = useNavigate();
//   const [currentRole, setcurrentRole] = useState("");
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [role, setRole] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [plan, setPlan] = useState("");
//   const [token, setToken] = useState("");

//   useEffect(() => {
//     const loginData = localStorage.getItem("loginData");
//     var em, rol, pho, tok, pla;
//     if (loginData) {
//       em = JSON.parse(loginData)?.email;
//       pho = JSON.parse(loginData)?.phone;
//       tok = JSON.parse(loginData)?.token;
//       rol = JSON.parse(loginData)?.role;
//       pla = JSON.parse(loginData)?.plan;
//       setcurrentRole(rol);
//       setEmail(em);
//       if (rol === "seller") {
//         setRole("buyer");
//       }
//       if (rol === "buyer") {
//         setRole("seller");
//       }
//       setPhone(pho);
//       setPlan(pla);
//       setToken(tok);
//     }
//     if (loginData) {
//       setLoggedIn(true);
//       const token = JSON.parse(loginData)?.token;
//       const userEmail = JSON.parse(loginData)?.email;
//       const userRole = JSON.parse(loginData)?.role;
//       if (userRole === "seller") {
//         setRole("buyer");
//       }
//       if (userRole === "buyer") {
//         setRole("seller");
//       }
//     } else {
//       navigate("/login");
//     }
//   }, [navigate, role]);

//   const handleSubmit = () => {
 
//     const formData = new FormData();
//     formData.append("email", email);
//     formData.append("phone", phone);
//     formData.append("token", token);
//     formData.append("role", role);
//     formData.append("plan", plan);

//     if (loggedIn && email) {
//       fetch(`http://localhost:5189/api/Login/SwitchRoles`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ` + token,
//         },
//         body: formData,
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           console.log("data", data);
//           toast.success(`Role switched to ${data?.role}!`);
//           localStorage.setItem("loginData", JSON.stringify(data));
//           setcurrentRole(data.role);
//         })
//         .catch((error) => {
//           toast.error(`Error switching roles`);
//           console.error("Fetch error:", error); // Handle any errors that occur during fetch
//         });
//     }
//   };

//   return (
//     loggedIn && (
//       <div className=" flex sm:h-screen justify-start items-center space-x-2 flex-wrap space-y-2">
//         {currentRole === "seller" && <span>Switch to buyer account?</span>}
//         {currentRole === "buyer" && <span>Switch to seller account</span>}
//         <Button
//           title={`${currentRole === "seller" ? "Buyer" : "Seller"}`}
//           onClick={handleSubmit}
//         />
//       </div>
//     )
//   );
// };

// export default SwitchRole;


import React, { useEffect, useState } from "react";
import PropertyCard from "../components/Property-card.tsx";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.tsx";
import { toast } from "react-toastify";
// import img from "../assets/buyerToSeller.jpeg"

const SwitchRole = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      const { email, phone, token, role, plan } = parsedData;

      setEmail(email);
      setPhone(phone);
      setToken(token);
      setCurrentRole(role);
      setPlan(plan);
      setLoggedIn(true);

      setRole(role === "seller" ? "buyer" : "seller");
    } else {
      navigate("/login");
    }
  }, [navigate, role, loggedIn,currentRole]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("token", token);
    formData.append("role", role);
    formData.append("plan", plan);

    if (loggedIn && email) {
      fetch(`http://localhost:5189/api/Login/SwitchRoles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ` + token,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
          toast.success(`Role switched to ${data?.role}!`);
          localStorage.setItem("loginData", JSON.stringify(data));
          setCurrentRole(data.role);
          setRole(data.role === "seller" ? "buyer" : "seller");
          const event = new CustomEvent('roleChanged', { detail: data.role });
          window.dispatchEvent(event);
        })
        .catch((error) => {
          toast.error(`Error switching roles`);
          console.error("Fetch error:", error);
        });
    }
  };

  return (
    loggedIn && (
      <div className="flex flex-col h-[50%] justify-start items-center space-x-2 flex-wrap space-y-2">
        
        {currentRole === "seller" && <div> <img src="/assets/sellerToBuyer.jpeg" alt="buyer?" /> <span> Switch to buyer account?</span></div>}
        {currentRole === "buyer" && <div><img src="/assets/buyerToSeller.jpeg" alt="seller?" /><span>Switch to seller account?</span></div>}
        <Button
          // title={`${currentRole === "seller" ? "Buyer" : "Seller"}`}
          title="Switch"
          onClick={handleSubmit}
        />
      </div>
    )
  );
};

export default SwitchRole;
