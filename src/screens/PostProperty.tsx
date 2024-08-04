import React, { useEffect, useState } from "react";
import Container from "../components/Container.tsx";
import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getCityFromGeolocation from "../components/GeolocationFunction.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation } from "@fortawesome/free-solid-svg-icons";

interface MediaItem {
  filedata: File;
  url: string;
  type: string;
}
const PostProperty = () => {

const navigate = useNavigate();

  const [loggedIn,setLoggedIn] = useState(false)
  const [role,setRole] =  useState("")

  const [userData, setUserData] = useState({
    userEmail:"",
    phone:"",
    location: "",
    name: "",
    propertyType: "",
    price:0,
    commercialSubtype: "",
    residentialSubtype: "",
    propertyDetails: {
      propertyDimensionsWidth: 0,
      propertyDimensionsLength: 0,
      hasConstructions: false,
      widthofFacingRoad: 0,
      commercialAreaInSqFt: 0,
      numberOfBedrooms: 0,
      numberOfBathrooms: 0,
      areaInSqFt: 0,
    },
    media: [] as MediaItem[],
  });

  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [roleError, setRoleError] = useState("");


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => {
      if (name === "propertyType") {
        return {
          ...prevState,
          [name]: value,
          commercialSubtype: "",
          residentialSubtype: "",
        };
      } else if (
        name === "commercialSubtype" ||
        name === "residentialSubtype"
      ) {
        return {
          ...prevState,
          [name]: value,
          ...(name === "commercialSubtype" && { residentialSubtype: "" }),
          ...(name === "residentialSubtype" && { commercialSubtype: "" }),
        };
      }
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handlePropertyDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setUserData((prev) => ({
        ...prev,
        propertyDetails: {
          ...prev.propertyDetails,
          [name]: checked,
        },
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        propertyDetails: {
          ...prevState.propertyDetails,
          [name]: value,
        },
      }));
    }
  };

  const handleMediaChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newMediaItems = filesArray.map((file: any) => ({
        filedata: file,
        url:"",
        type: file.type,
      }));
      setUserData((prevState) => ({
        ...prevState,
        media: [...prevState.media, ...newMediaItems],
      }));
    }
  };

  const handleGetCity = () => {
    getCityFromGeolocation((city) => {
      setUserData((prevState) => ({
        ...prevState,
        location: city,
      }));
      // console.log(userData)
    });
  };
  
  useEffect(() => {
    var res = localStorage.getItem("loginData")
          if(res){

            if(JSON.parse(res)?.email && JSON.parse(res)?.role==="seller"){

              setLoggedIn(true)
              setRole("seller")
            }
            else if(JSON.parse(res)?.email && JSON.parse(res)?.role==="buyer")
              {
                setLoggedIn(false)
                setRole("buyer")
                navigate('/view-properties')
              }
              else{
                navigate('/login')
              }
            }
            else{
              navigate('/login')
            }
          }, [loggedIn, role, navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var res = localStorage.getItem("loginData");
    var email, phone;
    if (res) {
      email = JSON.parse(res)?.email;
      phone = JSON.parse(res)?.phone;
    }
  
    const formData = new FormData();
    formData.append('userEmail', email || userData.userEmail);
    formData.append('name', userData.name);
    formData.append('phone', phone || userData.phone);
    formData.append('propertyType', userData.propertyType);
  
    // Append property details
    for (const [key, value] of Object.entries(userData.propertyDetails)) {
      formData.append(`propertyDetails.${key}`, value.toString()); // Convert numbers to string
    }
  
    formData.append('residentialSubtype', userData.residentialSubtype);
    formData.append('commercialSubtype', userData.commercialSubtype);
    formData.append('location', userData.location);
    // console.log(userData)
    formData.append('price', userData.price.toString()); // Convert number to string
  
    // Append media files
    userData.media.forEach((item, index) => {
      if (item.filedata instanceof File) {
        formData.append(`media[${index}].file`, item.filedata); // Assuming `item.file` is a File object
      } else {
        // console.error("Invalid file type for media item:", item);
      }
      formData.append(`media[${index}].url`, item.url);
      formData.append(`media[${index}].type`, item.type);
    });
    var res=localStorage.getItem("loginData");
    if(res)
      var token = JSON.parse(res)?.token
    try {
      const response = await fetch("http://localhost:5189/api/Property/PostProperty", {
        method: "POST",
        headers: {
          "Authorization": "Bearer "+token,
        },
        body: formData,
      });
  
      if (response.ok) {
        // console.log("Property posted successfully!");
        toast.success("Property posted successfully!")
        navigate('/my-properties')
      } else {
        // console.error("Failed to post property.");
        // console.log(response)
        const errorText = await response.text();
        toast.error("Failed to post property.")
        // console.error("Error details:", errorText);
      }
    } catch (error) {
      // console.error("An error occurred while posting the property:", error);
    }
  };
  


  return (
    (loggedIn&&role==="seller"&&(
    <Container className="sm:mt-20  pb-10">
      <Card className="space-y-4  md:w-[65%] w-[80%]">
        <span className="text-2xl">Post Property</span>
        <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between w-full space-x-2 ">
          <div className=" flex flex-col justify-center items-start w-[50%]">
            <label htmlFor="name" className="text-xs">
              Name
            </label>
            <input
              className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
              name="name"
              id="name"
              type="text"
              placeholder="Enter Property Name"
              onChange={handleInputChange}
              value={userData.name}
            />
            <span className="text-xs self-start w-full text-red-500">
              {nameError}
            </span>
          </div>
          <div className=" flex flex-col justify-center items-start w-[50%]">
            <label htmlFor="location" className="text-xs">
              Location
            </label>
            <div className="flex w-full">

            <input
              className="border border-neutral-300 rounded-l w-full px-4 py-1 focus:outline-blue-400"
              name="location"
              id="location"
              type="text"
              placeholder="Enter Location"
              onChange={handleInputChange}
              value={userData.location}
            />
            <button className=" rounded-r bg-blue-400 "  onClick={handleGetCity}><FontAwesomeIcon icon={faLocation} className="h-4 w-4 mx-2 text-white" /></button>
            </div>
            <span className="text-xs self-start w-full text-red-500">
              {locationError}
            </span>
          </div>
        </div>
        <span>
          <span className="flex text-xs sm:self-start self-center justify-center sm:justify-start flex-wrap w-full py-4">
            Property type{" "}
          </span>
          <div className="flex sm:justify-start justify-center flex-wrap w-full sm:flex-nowrap  space-y-0 space-x-2">
            <div>
              <input
                type="radio"
                id="Residential"
                name="propertyType"
                value="Residential"
                checked={userData.propertyType === "Residential"}
                onChange={handleInputChange}
                className="hidden"
              />
              <label
                htmlFor="Residential"
                className={`cursor-pointer rounded-full font-normal sm:font-semibold bg-blue-50 text-blue-500 px-4 py-2 transition-colors duration-200 ease-in-out ${
                  userData.propertyType === "Residential"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100"
                }`}
              >
                Residential
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="Commercial"
                name="propertyType"
                value="Commercial"
                checked={userData.propertyType === "Commercial"}
                onChange={handleInputChange}
                className="hidden"
              />
              <label
                htmlFor="Commercial"
                className={`cursor-pointer rounded-full font-normal  sm:font-semibold bg-blue-50 text-blue-500 px-4 py-2 transition-colors duration-200 ease-in-out ${
                  userData.propertyType === "Commercial"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100"
                }`}
              >
                Commercial
              </label>
            </div>
          </div>
        </span>

        {userData.propertyType && (
          <>
            <span>
              {userData.propertyType === "Residential" ? (
                <>
                  <span className="flex self-start justify-center text-xs sm:justify-start flex-wrap w-full py-4">
                    Choose a Residential Subtype
                  </span>
                  <div className="flex flex-wrap justify-center sm:justify-start sm:flex-nowrap  space-y-0 space-x-2">
                    <div>
                      <input
                        type="radio"
                        id="Villa"
                        name="residentialSubtype"
                        value="Villa"
                        checked={userData.residentialSubtype === "Villa"}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="Villa"
                        className={`cursor-pointer rounded-full font-normal sm:font-semibold bg-blue-50 text-blue-500 px-4 py-2 transition-colors duration-200 ease-in-out ${
                          userData.residentialSubtype === "Villa"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100"
                        }`}
                      >
                        Villa
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="Apartment"
                        name="residentialSubtype"
                        value="Apartment"
                        checked={userData.residentialSubtype === "Apartment"}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="Apartment"
                        className={`cursor-pointer rounded-full font-normal sm:font-semibold bg-blue-50 text-blue-500 px-4 py-2 transition-colors duration-200 ease-in-out ${
                          userData.residentialSubtype === "Apartment"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100"
                        }`}
                      >
                        Apartment
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="Pg"
                        name="residentialSubtype"
                        value="Pg"
                        checked={userData.residentialSubtype === "Pg"}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="Pg"
                        className={`cursor-pointer rounded-full font-normal sm:font-semibold bg-blue-50 text-blue-500 px-4 py-2 transition-colors duration-200 ease-in-out ${
                          userData.residentialSubtype === "Pg"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100"
                        }`}
                      >
                        PG
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex self-start justify-center text-xs sm:justify-start flex-wrap w-full py-4">
                    Choose a Commercial Subtype
                  </span>
                  <div className="flex flex-wrap justify-center sm:justify-start sm:flex-nowrap space-y-0 space-x-2">
                    <div>
                      <input
                        type="radio"
                        id="Plot"
                        name="commercialSubtype"
                        value="Plot"
                        checked={userData.commercialSubtype === "Plot"}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="Plot"
                        className={`cursor-pointer rounded-full font-normal sm:font-semibold bg-blue-50 text-blue-500 px-4 py-2 transition-colors duration-200 ease-in-out ${
                          userData.commercialSubtype === "Plot"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100"
                        }`}
                      >
                        Plot
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="Hospitality"
                        name="commercialSubtype"
                        value="Hospitality"
                        checked={userData.commercialSubtype === "Hospitality"}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="Hospitality"
                        className={`cursor-pointer rounded-full font-normal sm:font-semibold bg-blue-50 text-blue-500 px-4 py-2 transition-colors duration-200 ease-in-out ${
                          userData.commercialSubtype === "Hospitality"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100"
                        }`}
                      >
                        Hospitality
                      </label>
                    </div>
                  </div>
                </>
              )}
            </span>
          </>
        )}
        {userData.propertyType && userData.commercialSubtype && (
          <>
            <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between w-full space-x-2">
              <div className=" flex flex-col justify-center items-start w-[50%]">
                <label htmlFor="propertyDimensionsWidth" className="text-xs">
                  Property Width
                </label>
                <input
                  className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
                  name="propertyDimensionsWidth"
                  id="propertyDimensionsWidth"
                  type="number"
                  placeholder="Enter Property Dimensions in width"
                  onChange={handlePropertyDetailsChange}
                  value={userData.propertyDetails.propertyDimensionsWidth}
                />
                <span className="text-xs self-start w-full text-red-500">
                  {nameError}
                </span>
              </div>
              <div className=" flex flex-col justify-center items-start w-[50%]">
                <label htmlFor="propertyDimensionsLength" className="text-xs">
                  Property Length
                </label>
                <input
                  className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
                  name="propertyDimensionsLength"
                  id="propertyDimensionsLength"
                  type="number"
                  placeholder="Enter Property Dimensions in Length"
                  onChange={handlePropertyDetailsChange}
                  value={userData.propertyDetails.propertyDimensionsLength}
                />
                <span className="text-xs self-start w-full text-red-500">
                  {nameError}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between w-full space-x-2">
              <div className=" flex flex-col justify-center items-start w-[50%]">
                <label htmlFor="widthofFacingRoad" className="text-xs">
                  Width of Facing Road
                </label>
                <input
                  className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
                  name="widthofFacingRoad"
                  id="widthofFacingRoad"
                  type="number"
                  placeholder="Enter the Width of the Facing Road"
                  onChange={handlePropertyDetailsChange}
                  value={userData.propertyDetails.widthofFacingRoad}
                />
                <span className="text-xs self-start w-full text-red-500">
                  {nameError}
                </span>
              </div>
              <div className=" flex flex-col justify-center items-start w-[50%]">
                <label htmlFor="commercialAreaInSqFt" className="text-xs">
                  Area in Sq.Ft
                </label>
                <input
                  className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
                  name="commercialAreaInSqFt"
                  id="commercialAreaInSqFt"
                  type="text"
                  placeholder="Enter Area in Sq.Ft"
                  onChange={handlePropertyDetailsChange}
                  value={userData.propertyDetails.commercialAreaInSqFt}
                />
                <span className="text-xs self-start w-full text-red-500">
                  {nameError}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between w-full space-x-2">
              <div className=" flex flex-col justify-center items-start">
                <label htmlFor="widthofFacingRoad" className="text-xs">
                  Does it have constructions?
                </label>
                <input
                  type="checkbox"
                  name="hasConstructions"
                  checked={userData.propertyDetails.hasConstructions}
                  onChange={handlePropertyDetailsChange}
                  className="mt-1"
                />
                <span className="text-xs self-start w-full text-red-500">
                  {nameError}
                </span>
              </div>
            </div>
          </>
        )}
        {userData.propertyType && userData.residentialSubtype && (
          <>
            <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between w-full space-x-2">
              <div className=" flex flex-col justify-center items-start w-[50%]">
                <label htmlFor="numberOfBedrooms" className="text-xs">
                  Number of Bedrooms
                </label>
                <input
                  className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
                  name="numberOfBedrooms"
                  id="numberOfBedrooms"
                  type="number"
                  placeholder="Enter Number of Bedrooms"
                  onChange={handlePropertyDetailsChange}
                  value={userData.propertyDetails.numberOfBedrooms}
                />
                <span className="text-xs self-start w-full text-red-500">
                  {nameError}
                </span>
              </div>
              <div className=" flex flex-col justify-center items-start w-[50%]">
                <label htmlFor="numberOfBathrooms" className="text-xs">
                  Number of Bathrooms
                </label>
                <input
                  className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
                  name="numberOfBathrooms"
                  id="numberOfBathrooms"
                  type="number"
                  placeholder="Enter Number of Bathrooms"
                  onChange={handlePropertyDetailsChange}
                  value={userData.propertyDetails.numberOfBathrooms}
                />
                <span className="text-xs self-start w-full text-red-500">
                  {nameError}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between w-full space-x-2">
              <div className=" flex flex-col justify-center items-start w-[50%]">
                <label htmlFor="areaInSqFt" className="text-xs">
                  Area in Sq.Ft
                </label>
                <input
                  className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
                  name="areaInSqFt"
                  id="areaInSqFt"
                  type="number"
                  placeholder="Enter the Area in Sq.Ft"
                  onChange={handlePropertyDetailsChange}
                  value={userData.propertyDetails.areaInSqFt}
                />
                <span className="text-xs self-start w-full text-red-500">
                  {nameError}
                </span>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-center sm:justify-start w-full space-x-2">
          <div className=" flex flex-col justify-center items-start">
            <label htmlFor="media" className="text-xs mb-1">
              Media(Images and Videos)
            </label>
            <input
              className="file:border-none file:font-normal sm:font-semibold file:text-blue-500 w-full file:rounded-full file:bg-blue-50 file:px-4 file:py-2 "
              type="file"
              id="media"
              name="media"
              accept="image/png, image/jpeg, video/mp4"
              multiple
              onChange={handleMediaChange}
            />
            <div className="mt-2">
               
                {userData.media &&
                  userData.media.length > 0 &&
                  userData.media.map((file, index) => (
                    <div key={index} className="mb-2">
                      <img
                        src={URL.createObjectURL(file.filedata)}
                        alt={`New Media ${index}`}
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  ))}
              </div>
          </div>
        </div>
        <div className="flex justify-center sm:justify-start w-full space-x-2">
        <div className=" flex flex-col justify-center  items-start">
          <label htmlFor="price" className="text-xs">
              Price
            </label>
            <input
              className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
              name="price"
              id="price"
              type="text"
              placeholder="Enter price"
              onChange={handleInputChange}
              value={userData.price}
            />
            <span className="text-xs self-start w-full text-red-500">
              {priceError}
            </span>
            </div>
            </div>
        <Button onClick={handleSubmit} title="Post Property" />
      </Card>
    </Container>
    ))
  );
};

export default PostProperty;
