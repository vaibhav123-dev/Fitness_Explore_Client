import React, { useState } from "react";
import { toast } from "react-toastify";
import { validateEmail } from "../services/common";
import { postRequest } from "../common/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice.js";
import { useAuth } from "../hooks/auth.jsx";

export const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const {updateUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((formData?.email === "" && formData?.username === "") || formData?.password === "") {
      return toast.warning("Please fill in the required fields");
    }
    if (formData?.email && !validateEmail(formData?.email)) {
      return toast.error("Invalid Email Address");
    }

    const user = await postRequest("/api/users/login", formData);

    toast.success("Login successful");
    if (user?.error) {
      return toast.error(user?.error);
    } else {
      updateUser(user?.data);
      dispatch(setUser(user?.data?.user));
    }

    setFormData({
      email: "",
      password: "",
      username: "",
    });
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Login</h1>
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="username"
            placeholder="Username (optional)"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            className="w-full text-center py-3 rounded bg-blue-500 text-white hover:bg-blue-700 focus:outline-none my-1"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
