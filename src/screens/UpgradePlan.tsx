import React, { useEffect, useState } from "react";
import PropertyCard from "../components/Property-card.tsx";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.tsx";
import { toast } from "react-toastify";

const UpgradePlan = () => {
  const navigate = useNavigate();
  const [currentPlan, setcurrentPlan] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    var em, plan;
    if (loginData) {
      em = JSON.parse(loginData)?.email;
      plan = JSON.parse(loginData)?.plan;
      setcurrentPlan(plan);
      setEmail(em)
    }
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      const token = parsedData?.token;
      const userEmail = parsedData?.email;
      const userRole = parsedData?.role;

      if (userEmail && userRole) {
        setEmail(userEmail);
        setRole(userRole);
        setLoggedIn(true);
        
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit=() => {
    
   
   
        var setPlan;
        if(currentPlan==="Basic")
        setPlan = true;
        if(currentPlan==="Premium")
            setPlan=false;
        const formData = new FormData();
        formData.append('email', email  );
        
        
        if (loggedIn && email) {
            console.log(setPlan)
          fetch(`http://localhost:5189/api/Login/UpgradePlan?upgradeplan=${setPlan}`, {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loginData") || '{}')?.token}`,
            },
            body: formData
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("data", data);
              toast.success(`Plan switched to ${data?.plan}!`)
              localStorage.setItem("loginData", JSON.stringify(data))
              setcurrentPlan(data.plan);
            })
            .catch((error) => {
              toast.error(error)
              console.error('Fetch error:', error); // Handle any errors that occur during fetch
            });
        
    }
  };

  return (loggedIn && (
    <div className=" flex flex-col justify-start items-center space-x-2 flex-wrap space-y-2">
        {currentPlan==="Basic"&&(<div> <img src="/assets/upgrade.jpeg" alt="buyer?" /> <span>Upgrade to premium?</span></div>)}
        {currentPlan==="Premium"&&(<div> <img src="/assets/downgrade.jpeg" alt="buyer?" /> <span>
        Downgrade to basic
      </span></div>)}
      <Button title={`${currentPlan==="Basic"?"Upgrade":"Downgrade"}`} onClick={handleSubmit} />
      
    </div>
  ));
};

export default UpgradePlan;
