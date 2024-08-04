import React, { useState } from "react";
import Container from "../components/Container.tsx";
import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Register = () => {

  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    UserEmail: "",
    Name: "",
    Phone: "",
    Role: "",
    Password: "",
  });

  const [cPassword, setCPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setCPasswordError] = useState("");

  const handleChangeCpassword = (e) => {
    setCPassword(e.target.value);
  };

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
  const validateName = (name) => {
    if (String(name).toLowerCase().length >= 2) {
      setNameError("");
    } else {
      setNameError("Name must be atleast 2 characters");
    }
  };
  const validatePassword = (email) => {
    if (
      String(email)
        .match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
    ) {
      setPasswordError("");
    } else {
      setPasswordError("Password is weak");
    }
  };
  const validatecPassword = (email) => {
    if (String(email).match(userData.Password)) {
      setCPasswordError("");
    } else {
      setCPasswordError("Password mismatch");
    }
  };
  const validatePhone = (email) => {
    if (
      String(email).toLowerCase().length >= 1 &&
      String(email).toLowerCase().length <= 10
    ) {
      setPhoneError("");
    } else {
      setPhoneError("Enter valid Phone Number");
    }
  };
  const validateRole = (email) => {
    if (
      String(email)==""
    ) {
      setRoleError("");
    } else {
      setRoleError("Please choose a role");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Phone", userData.Phone);
    formData.append("UserEmail", userData.UserEmail);
    formData.append("Name", userData.Name);
    formData.append("Role", userData.Role);
    formData.append("Password", userData.Password);

    try {
      const response = await fetch("http://localhost:5189/api/Login/Register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Registered successfully");
        toast.success(`Successfully registered`)
        navigate('/login');
      } else {
        console.log("Upload failed");
      }
    } catch (error) {
      toast.error(error)
      console.error("Error uploading property:", error);
    }
    console.log(userData)
  };

  return (
    <Container >
      <Card className="sm:w-[50%]">
        {/* <form action="" className="w-full space-y-2"> */}
        <span className="text-2xl">Register</span>
        <input
          className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
          name="UserEmail"
          id="UserEmail"
          type="email"
          placeholder="Enter Email"
          onChange={(e: any) => {
            validateEmail(e.target.value);
            handleInputChange(e);
          }}
          value={userData.UserEmail}
        />
        <span className="text-xs self-start w-full text-red-500">{emailError}</span>
        <input
          className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
          name="Name"
          id="Name"
          type="text"
          placeholder="Enter Name"
          onChange={(e: any) => {
            validateName(e.target.value);
            handleInputChange(e);
          }}
          value={userData.Name}
        />
        <span className="text-xs self-start w-full text-red-500">{nameError}</span>
        <input
          className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
          name="Phone"
          id="Phone"
          type="phone"
          placeholder="Enter Phone"
          onChange={(e: any) => {
            validatePhone(e.target.value);
            handleInputChange(e);
          }}
          value={userData.Phone}
        />
        <span className="text-xs self-start w-full text-red-500">{phoneError}</span>
        <div></div>
        <input
          className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
          name="Password"
          id="Password"
          type="password"
          placeholder="Enter Password"
          onChange={(e: any) => {
            validatePassword(e.target.value);
            handleInputChange(e);
          }}
          value={userData.Password}
        />
        <span className="text-xs self-start w-full text-red-500">{passwordError}</span>
        <input
          className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
          name="CPassword"
          id="CPassword"
          type="password"
          placeholder="Enter Confirm Password"
          onChange={(e: any) => {
            validatecPassword(e.target.value);
            handleChangeCpassword(e);
          }}
          value={cPassword}
        />
        <span className="text-xs self-start w-full text-red-500">{cPasswordError}</span>
        <select
          className="border border-neutral-300 rounded-md w-full px-4 py-1 focus:outline-blue-400"
          name="Role"
          id="Role"
          onChange={(e: any) => handleInputChange(e)}
          value={userData.Role}
        >
          <option value="">Select Role</option>
          <option value="seller">Seller</option>
          <option value="buyer">Buyer</option>
        </select>
        <span className="text-xs self-start w-full text-red-500">{roleError}</span>
        <Button onClick={handleSubmit} title="Register" />

        <span className="py-4">
          Already a User?
          <a
            href="/login"
            className="ml-2 font-medium text-blue-400 no-underline "
          >
            Login
          </a>
        </span>
        {/* </form> */}
      </Card>
    </Container>
  );
};

export default Register;
