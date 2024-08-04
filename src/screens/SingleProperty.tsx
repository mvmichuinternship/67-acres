import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import Modal from "../components/Modal.tsx";
import UpgradePlan from "../screens/UpgradePlan.tsx";

const SingleProperty = () => {
  const { pid } = useParams();
  // console.log(pid);

  const navigate = useNavigate();

  const [property, setProperty] = useState<any>({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<any>("");
  const [plan, setPlan] = useState<any>("");
  const [email1, setEmail] = useState("");
  const [phone, setPhone] = useState<any>("");
  const [showContact, setShowContact] = useState(false);
  const [deleteProperty, setDeleteProperty] = useState(false);
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);

  const toggleUpgradePlanModal = () => {
    setIsUpgradePlanModalOpen(!isUpgradePlanModalOpen);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    var res = localStorage.getItem("loginData");
    if (res) {
      setPlan(JSON.parse(res)?.plan)
      if (JSON.parse(res)?.email && JSON.parse(res)?.role === "seller") {
        setLoggedIn(true);
        setRole("seller");
        setEmail(JSON.parse(res)?.email)
      } else if (JSON.parse(res)?.email && JSON.parse(res)?.role === "buyer") {
        setLoggedIn(true);
        setRole("buyer");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [loggedIn, role, navigate,plan]);

  useEffect(() => {
    var res = localStorage.getItem("loginData");
    if (res) var token = JSON.parse(res)?.token;
    fetch(`http://localhost:5189/api/Property/GetProperty?property=${pid}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(email1);
        setProperty(data);
      })
      .catch((error) => {
        // console.error("Fetch error:", error);
        navigate("/view-properties");
      });
  }, [pid, navigate]);

  const handleDelete=(e)=> {
    var res = localStorage.getItem("loginData");
    if(res)
    var parsedData = JSON.parse(res);
  const {email, phone} = parsedData
    setEmail(email);
      setPhone(phone);
      var subject = "Contacting via 67acres"
      var htmlcontent=`<h1>Inquiry about property ${property?.name}</h1>`
    if (res) var token = JSON.parse(res)?.token;
    fetch(`http://localhost:5189/api/Property/DeleteProperty?postPropertyDTO=${pid}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
      
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        toast.success(`Deleted successfully`)
        setDeleteProperty(false);
      })
      .catch((error) => {
        toast.error(error)
        toast.error("Cannot delete property at the moment")
        // console.error("Fetch error:", error);
        
      });
  }

  const handleSendEmail=async()=>{
    var res =  localStorage.getItem("loginData");
    var email2;
    if(res){

      var parsedData = JSON.parse(res);
    const {email, phone} = parsedData
      email2=email
        setPhone(phone);
    }
    console.log(email2)
      var subject = "Contacting via 67acres"
      var htmlcontent=`<html><h1>Inquiry about property ${property?.name}</h1></html>`
      const send = {
        toEmail:email2.toString(),
        subject: subject, 
        htmlContent: htmlcontent
      }
    if (res) var token = JSON.parse(res)?.token;
    fetch(`http://localhost:5189/api/Email/send`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(send)
      
    })
      .then(async(resp) => {
        // console.log(resp)
        toast.success(`Email sent successfully`)
        return await resp.json();
      })
      .catch((error) => {
        toast.error(error)
        toast.error("Cannot send email at the moment")
        // console.error("Fetch error:", error);
        
      });
  }
 

  return (
    loggedIn && (
      <div className="flex w-full justify-center items-center h-screen mt-16 p-4 md:mt-0 md:p-10  ">
        <div className="w-full md:w-3/4 ">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Property Details
          </h1>
          <div className="flex flex-col md:flex-row mb-6 justify-between items-start space-y-10 md:space-y-0">
            <div className=" w-full md:w-1/2 max-h-lg h-1/2 z-1">
              <Slider {...sliderSettings} className="text-blue-400 relative z-1">
                {property?.media?.map((mediaItem: any, index: number) => (
                  <div key={index} className="">
                    {mediaItem.type === "image/jpeg" || mediaItem.type ==="image/png" ? (
                      <img
                        src={mediaItem.url}
                        alt={`media-${index}`}
                        className="w-full h-56 object-fit rounded-lg"
                      />
                    ) : (
                      <video
                        src={mediaItem.url}
                        controls
                        className="w-full h-56 object-fill rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </Slider>
            </div>
            <div className="w-full md:pl-6 md:w-1/2 mt-6 md:mt-0 md:ml-6 flex flex-col justify-between md:items-start items-start">
              <p className="mb-2 text-nowrap">
                <strong>Location:</strong> {property.location}
              </p>
              <p className="mb-2 ">
                <strong>Price:</strong> ${property.price}
              </p>
              {property.propertyType === "Residential" && (
                <>
                  <p className="mb-2 ">
                    <strong>Type:</strong> {property.residentialSubtype}
                  </p>
                  <p className="mb-2 ">
                    <strong>Bedrooms:</strong>{" "}
                    {property.propertyDetails.numberOfBedrooms}
                  </p>
                  <p className="mb-2 ">
                    <strong>Bathrooms:</strong>{" "}
                    {property.propertyDetails.numberOfBathrooms}
                  </p>
                  <p className="mb-2 ">
                    <strong>Area (sq ft):</strong>{" "}
                    {property.propertyDetails.areaInSqFt}
                  </p>
                </>
              )}
              {property.propertyType === "Commercial" && (
                <>
                  <p className="mb-2 ">
                    <strong>Type:</strong> {property.commercialSubtype}
                  </p>
                  <p className="mb-2 ">
                    <strong>Width (ft):</strong>{" "}
                    {property.propertyDetails.propertyDimensionsWidth}
                  </p>
                  <p className="mb-2 ">
                    <strong>Length (ft):</strong>{" "}
                    {property.propertyDetails.propertyDimensionsLength}
                  </p>
                  <p className="mb-2 ">
                    <strong>Has Constructions:</strong>{" "}
                    {property.propertyDetails.hasConstructions ? "Yes" : "No"}
                  </p>
                  <p className="mb-2 ">
                    <strong>Facing Road Width (ft):</strong>{" "}
                    {property.propertyDetails.widthofFacingRoad}
                  </p>
                  <p className="mb-2 ">
                    <strong>Commercial Area (sq ft):</strong>{" "}
                    {property.propertyDetails.commercialAreaInSqFt}
                  </p>
                </>
              )}
              {role === "buyer" && (
                <>
                  <div className="flex mt-4 space-x-2">
                    
                    <button
                      onClick={handleSendEmail}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Send Email
                    </button>
                    {plan==="Premium" && !showContact&&(
                    <button
                      onClick={() => {setShowContact(true)}}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      View contact
                    </button>)}
                    {plan==="Basic" &&(
                      <div>
                    <button
                      onClick={toggleUpgradePlanModal}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Upgrade to view contact
                    </button>
                    <Modal
                    show={isUpgradePlanModalOpen}
                    onClose={toggleUpgradePlanModal}
                    title="Upgrade Plan Modal"
                  >
                    <UpgradePlan />
                  </Modal>
                  </div>
                  )}
                  </div>
                  {showContact && (
                    <div className="mt-4">
                      <p className="mb-2">
                        <strong>Email:</strong> {property.userEmail}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {property.phone}
                      </p>
                    </div>
                  )}
                </>
              )}
              {role === "seller" && (
                <div className="flex mt-4">
                  <button className="bg-blue-500 text-white py-2 px-4 rounded mr-2" onClick={()=>navigate(`/edit-property/${pid}`)}>
                    Edit
                  </button>
                  {!deleteProperty&&(
                  <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={()=>setDeleteProperty(true)}>
                    Delete
                  </button>)}
                  </div>
                  )}
                  {deleteProperty &&(
                    <div className="mt-4">

                    <div className="text-nowrap text-sm mb-2">Are you sure you want to delete?</div>
                    <div className="flex space-x-2 justify-center">
                    <button className="bg-green-500 text-white py-1 px-4 rounded" onClick={handleDelete}>
                    Yes
                  </button>
                    <button className="bg-red-500 text-white py-1 px-4 rounded" onClick={()=>{setDeleteProperty(!deleteProperty); navigate("/my-properties")}}>
                    No
                  </button>
                  </div>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SingleProperty;
