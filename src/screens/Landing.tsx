import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Landing = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const media = [
    "https://cdn.pixabay.com/photo/2017/04/10/22/28/residence-2219972_1280.jpg",
    "https://cdn.pixabay.com/photo/2023/07/27/19/57/castle-8153987_1280.jpg",
    "https://cdn.pixabay.com/photo/2022/07/10/19/30/house-7313645_1280.jpg",
    "https://cdn.pixabay.com/photo/2023/10/06/07/58/kitchen-8297678_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/08/14/05/17/manor-3604684_1280.jpg",
  ];
  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      const { role } = parsedData;
      setLoggedIn(true);
      setRole(role);
    }
  }, [loggedIn]);

  return (
    // <div className="pl-[6%] min-h-screen w-full flex flex-col">
    <div className="flex-grow flex flex-col justify-center items-center pt-50 w-full">
      <h1 className="text-4xl font-bold mb-2">Welcome to 67 Acres</h1>
      <p className="text-lg  text-center max-w-xl">
        Your one-stop solution for all real estate needs. Explore the best
        properties available in the market.
      </p>
      <div className="w-full relative md:max-w-3xl sm:max-w-lg max-w-md mx-auto p-4 mb-4">
        <Slider {...sliderSettings} className="-z-1">
          {media.map((mediaItem: any, index: number) => (
            <div key={index} className="p-2 z-0">
              <img
                src={mediaItem}
                alt={`media-${index}`}
                className="w-full h-72 object-cover z-0 rounded-lg"
              />
            </div>
          ))}
        </Slider>
      </div>
      
      <div className="flex space-x-4">
        {loggedIn && (
          <div className="flex space-x-4">
            <Link
              to="/view-properties"
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Properties
            </Link>
            <Link
              to="/post-property"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Post Property
            </Link>
          </div>
        )}
        {!loggedIn && (
          <div className="flex space-x-4">
            <Link
              to="/register"
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
    // </div>
  );
};

export default Landing;
