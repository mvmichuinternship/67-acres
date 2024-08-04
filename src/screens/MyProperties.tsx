import React, { useEffect, useState } from "react";
import PropertyCard from "../components/Property-card.tsx";
import { useNavigate } from "react-router-dom";

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      const userEmail = parsedData?.email;
      const userRole = parsedData?.role;

      if (userEmail && userRole) {
        setEmail(userEmail);
        setRole(userRole);
        setLoggedIn(userRole === "seller");
        if (userRole === "buyer") {
          navigate('/view-properties');
        }
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn && role === "seller" && email) {
      fetch('http://localhost:5189/api/Property/GetProperties', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loginData") || '{}')?.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log("data", data);
          const filteredProperties = data.filter((property: any) => property.userEmail === email);
          setProperties(filteredProperties);
        })
        .catch((error) => {
          // console.error('Fetch error:', error); // Handle any errors that occur during fetch
        });
    }
  }, [loggedIn, role, email]);

  return (loggedIn && role === "seller" && (
    <div className="h-full flex flex-col justify-center items-center z-1">
      <span className="text-3xl font-bold sm:pt-0 pt-12">My Properties</span>
    <div className="flex h-[100%] sm:h-[80%] justify-center items-center sm:space-x-2 flex-wrap sm:space-y-2 ">
      {properties.map((property: any, i: number) => (
        <div key={i} >
          <PropertyCard propertyData={property} />
        </div>
      ))}
    </div>
     </div>
  ));
};

export default MyProperties;
