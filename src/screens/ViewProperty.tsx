import React, { useEffect, useState } from "react";
import PropertyCard from "../components/Property-card.tsx";
import { useNavigate } from "react-router-dom";

const ViewProperty = () => {
  const navigate = useNavigate();
  const [properties, setProperties] :any = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [houseType, setHouseType] = useState("residential");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  
  const allLocation = Array.from(new Set(properties.map((p) => p.location))) ;
  const allResidentialTypes :any = ["Apartment", "Villa", "Pg"]
  const allCommercialTypes:any = ["Plot", "Hospitality"];

  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // console.log("loc", allLocation, "types", allResidentialTypes, allCommercialTypes)

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const token = JSON.parse(loginData)?.token;
      const userEmail = JSON.parse(loginData)?.email;
      const userRole = JSON.parse(loginData)?.role;

      if (userEmail && userRole) {
        setEmail(userEmail);
        setRole(userRole);
        setLoggedIn(true);
        if (userRole === "seller") {
          navigate('/my-properties');
        }
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn && email) {
      fetch('http://localhost:5189/api/Property/GetProperties', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loginData") || '{}')?.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log("data", data);
          const filteredProperties = data.filter((property: any) => property.userEmail !== email);
          setProperties(filteredProperties);
        })
        .catch((error) => {
          // console.error('Fetch error:', error); 
        });
    }
  }, [loggedIn, role, email]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const loc = e.target.value;
    if (selectedLocation.includes(loc)) {
      setSelectedLocation(selectedLocation.filter((el) => el !== loc));
    } else {
      setSelectedLocation([...selectedLocation, loc]);
    }
  };

  const handleTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value;
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((el) => el !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  useEffect(() => {
    filterProperties();
  }, [selectedLocation, selectedTypes, houseType, properties]);

  const handleHouseTypeChange = (val: string) => {
    setSelectedTypes([])
    setHouseType(val)
  }

  const filterProperties = () => {
    let filtered = properties;
  
    if (houseType === "residential") {
      filtered = filtered.filter((property: any) => property.propertyType === "Residential");
    } else if (houseType === "commercial") {
      filtered = filtered.filter((property: any) => property.propertyType === "Commercial");
    }
  
    if (selectedLocation.length > 0) {
      filtered = filtered.filter((property: any) => selectedLocation.includes(property.location));
    }
  
    if (selectedTypes.length > 0) {
      if (houseType === "all") {
        filtered = filtered
      }
      if (houseType === "residential") {
        filtered = filtered.filter((property: any) => selectedTypes.includes(property.residentialSubtype));
      } else {
        filtered = filtered.filter((property: any) => selectedTypes.includes(property.commercialSubtype));
      }
    }
  
    if (searchTerm) {
      filtered = filtered.filter((property: any) =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    // console.log("Filtered properties:", filtered); // Check the filtered data
  
    setFilteredProperties(filtered);
  };
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value !== "") {
      const searchSuggestions = properties.filter((property: any) =>
        property.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        property.location.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSuggestions(searchSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    filterProperties();
    setSuggestions([]);
  }

  return (loggedIn && role === "buyer" && (
    <div className="flex flex-col w-[90%]  items-center h-full ">
       <span className="text-3xl font-bold pb-10">View Properties</span>
       <div className="w-[80%] ">

      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search properties..."
            className="w-full p-2 border rounded-l"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
            Search
          </button>
        </form>
        {suggestions.length > 0 && (
          <div className="border rounded mt-2 p-2 bg-white shadow-lg">
            {suggestions.map((suggestion: any, idx) => (
              <div
                key={idx}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => setSearchTerm(suggestion.name)}
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap sm:flex-row flex-col justify-center items-center mb-4">
        <div className="flex flex-col w-1/2 p-2">
          <label className="font-bold mb-2">City</label>
          {allLocation.map((loc: any, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={loc}
                checked={selectedLocation.includes(loc)}
                onChange={handleLocationChange}
                className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
              />
              <label className="ml-2">{loc}</label>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-1/2 p-2">
          <label className="font-bold mb-2">House Type</label>
          <select
            value={houseType}
            onChange={(e) => handleHouseTypeChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">All</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap mb-4 sm:flex-row flex-col justify-center items-center">
        {houseType === "residential" && (
          <div className="flex flex-col  w-full p-2">
            <label className="font-bold mb-2 self-start">Residential Types</label>
            <div className="flex space-x-8">

            {allResidentialTypes.map((type: any, idx) => (
              <div key={idx} className="flex  sm:w-auto mb-2">
                <input
                  type="checkbox"
                  value={type}
                  checked={selectedTypes.includes(type)}
                  onChange={handleTypesChange}
                  className="form-checkbox h-4 w-4 text-blue-500 transition self-center duration-150 ease-in-out"
                />
                <label className="ml-2">{type}</label>
              </div>
            ))}
            </div>
          </div>
        )}
        {houseType === "commercial" && (
          <div className="flex flex-col w-full p-2">
            <label className="font-bold mb-2 self-start">Commercial Types</label>
            <div className="flex space-x-8">
            {allCommercialTypes.map((type: any, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={type}
                  checked={selectedTypes.includes(type)}
                  onChange={handleTypesChange}
                  className="form-checkbox h-4 w-4 text-blue-500 transition duration-150 ease-in-out"
                />
                <label className="ml-2">{type}</label>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
       </div>
      <div className="flex justify-center items-center flex-wrap sm:space-x-2 sm:space-y-2">
        {filteredProperties.map((property: any, i: number) => (
          <div key={i} className="flex justify-center items-center p-2">
            <PropertyCard propertyData={property} />
          </div>
        ))}
      </div>
     </div>
  ));
  
  
};

export default ViewProperty;
