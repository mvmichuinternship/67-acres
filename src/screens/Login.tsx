import React, { useEffect, useState } from "react";
import Container from "../components/Container.tsx";
import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {

  const navigate = useNavigate()

  const [signInMethod, setSignInMethod] = useState("");
  const [userData, setUserData] = useState({
    UserEmail: "",
    Password: "",
    PhoneNumber: "",
    OTP: "",
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const validateEmail = (email) => {
    if (
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setEmailError("");
    } else {
      setEmailError("Enter valid Email");
    }
  };

  const validatePassword = (password) => {
    if (
      String(password).match(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/
      )
    ) {
      setPasswordError("");
    } else {
      setPasswordError("Password is weak");
    }
  };

  const validatePhone = (phone) => {
    if (String(phone).match(/^\d{10}$/)) {
      setPhoneError("");
    } else {
      setPhoneError("Enter valid Phone Number");
    }
  };

  const validateOtp = (otp) => {
    if (otp.length === 6) {
      setOtpError("");
    } else {
      setOtpError("Enter valid OTP");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    validatePhone(userData.PhoneNumber);
    if (phoneError === "") {
      await fetch(
        `http://localhost:5189/api/Login/GenerateSms?phone=${userData.PhoneNumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: userData.PhoneNumber }),
        }
      )
        .then((res) => res.json())
        // .then((data) => console.log(data));
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async () => {
    validateOtp(userData.OTP);
    if (otpError === "") {
      try {
        const response = await fetch(
          `http://localhost:5189/api/Login/LoginViaOtp?phone=${userData.PhoneNumber}&otp=${userData.OTP}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: userData.PhoneNumber,
              otp: userData.OTP,
            }),
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          // console.log("OTP verification successful", data);
          localStorage.setItem("loginData", JSON.stringify(data));
          var res = localStorage.getItem("loginData")
          if(res){

            if(JSON.parse(res)?.email && JSON.parse(res)?.role==="seller")
              navigate('/my-properties')
            else if(JSON.parse(res)?.email && JSON.parse(res)?.role==="buyer")
              navigate('/view-properties')
            else{
              navigate('/login')
            }
          }
          // Handle successful OTP verification (e.g., redirect to dashboard)
        } else {
          const errorData = await response.json();
          console.error("OTP verification failed", errorData);
          // Handle OTP verification failure (e.g., show error message)
        }
      } catch (error) {
        console.error("Error verifying OTP", error);
        // Handle network or other errors (e.g., show error message)
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Email", userData.UserEmail);
    formData.append("Password", userData.Password);

    try {
      const response = await fetch(
        "http://localhost:5189/api/Login/LoginwithPassword",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(`Login successful`)
        // console.log("Login successful", response);
        window.location.reload()
        localStorage.setItem("loginData", JSON.stringify(data));
        var res = localStorage.getItem("loginData")
          if(res){

            if(JSON.parse(res)?.email && JSON.parse(res)?.role==="seller")
              navigate('/my-properties')
            else if(JSON.parse(res)?.email && JSON.parse(res)?.role==="buyer")
              navigate('/view-properties')
            else{
              navigate('/login')
            }
          }
      } else {
        toast.error("Login failed")
        // console.log("Login failed");
      }
    } catch (error) {
      toast.error(error)
      console.error("Error logging in:", error);
    }
    // console.log(userData);
  };

  useEffect(() => {
    var res = localStorage.getItem("loginData")
          if(res){

            if(JSON.parse(res)?.email && JSON.parse(res)?.role==="seller")
              navigate('/my-properties')
            else if(JSON.parse(res)?.email && JSON.parse(res)?.role==="buyer")
              navigate('/view-properties')
            else{
              navigate('/login')
            }
          }
  }, []);

  return (
    <Container >
      <Card className="sm:w-[40%]">
        <span className="text-2xl">Login</span>

        <div className="py-2 space-y-2 ">
          <Button
            onClick={() => setSignInMethod("password")}
            title="Sign In with Password"
            className={`${
              signInMethod === "password" ? "bg-blue-400 text-white" : ""
            } md:w-[50%] w-full`}
          />
          <Button
            onClick={() => setSignInMethod("otp")}
            title="Sign In with OTP"
            className={`${
              signInMethod === "otp" ? "bg-blue-400 text-white" : ""
            } md:w-[50%] w-full`}
          />
        </div>

        {signInMethod === "password" && (
          <>
            <input
              className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
              name="UserEmail"
              id="UserEmail"
              type="email"
              placeholder="Enter Email"
              onChange={(e) => {
                validateEmail(e.target.value);
                handleInputChange(e);
              }}
              value={userData.UserEmail}
            />
            <span className="text-xs self-start w-full text-red-500">
              {emailError}
            </span>

            <input
              className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
              name="Password"
              id="Password"
              type="password"
              placeholder="Enter Password"
              onChange={(e) => {
                validatePassword(e.target.value);
                handleInputChange(e);
              }}
              value={userData.Password}
            />
            <span className="text-xs self-start w-full text-red-500">
              {passwordError}
            </span>
            <Button onClick={handleSubmit} title="Login" />
          </>
        )}

        {signInMethod === "otp" && (
          <>
            <input
              className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
              name="PhoneNumber"
              id="PhoneNumber"
              type="text"
              placeholder="Enter Phone Number"
              onChange={(e) => {
                validatePhone(e.target.value);
                handleInputChange(e);
              }}
              value={userData.PhoneNumber}
            />
            <span className="text-xs self-start w-full text-red-500">
              {phoneError}
            </span>

            {!otpSent ? (
              <Button onClick={handleSendOtp} title="Send OTP" />
            ) : (
              <>
                <input
                  className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
                  name="OTP"
                  id="OTP"
                  type="text"
                  placeholder="Enter OTP"
                  onChange={(e) => {
                    validateOtp(e.target.value);
                    handleInputChange(e);
                  }}
                  value={userData.OTP}
                />
                <span className="text-xs self-start w-full text-red-500">
                  {otpError}
                </span>
                <Button onClick={handleVerifyOtp} title="Verify OTP" />
              </>
            )}
          </>
        )}

        <span className="py-4">
          Not yet Registered?
          <a
            href="/register"
            className="ml-2 font-medium text-blue-400 no-underline "
          >
            Sign Up
          </a>
        </span>
      </Card>
    </Container>
  );
};

export default Login;
