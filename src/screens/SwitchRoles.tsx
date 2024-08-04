import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.tsx";
import { toast } from "react-toastify";

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
      fetch(`https://67acres-webapp.azurewebsites.net/api/Login/SwitchRoles`, {
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
