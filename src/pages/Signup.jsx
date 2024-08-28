import React, { useState } from "react";
import { toast } from "react-toastify";
import { passwordsMatch, validateEmail } from "../services/common";
import { postRequest } from "../common/apiRequest";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      avatar: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      return toast.error("Invalid Email Address");
    }
    if (!passwordsMatch(formData)) {
      return toast.error("Password does not match");
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("fullName", formData.fullName);
    formDataToSubmit.append("username", formData.username);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("confirm_password", formData.confirm_password);
    if (formData.avatar) {
      formDataToSubmit.append("avatar", formData.avatar);
    }

    try {
      const user = await postRequest("/api/users/register", formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (user?.data) {
        console.log(user.data);
        toast.success("Signup successful");
      }
    } catch (error) {
      toast.error("Signup failed");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="fullName"
            placeholder="Fullname"
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email"
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
          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
          />
          <input
            type="file"
            className="hidden"
            id="customFileInput"
            name="avatar"
            onChange={handlePhotoChange}
          />
          <label
            htmlFor="customFileInput"
            className="block border border-grey-light w-full p-3 rounded mb-4 cursor-pointer"
          >
            Choose a file
          </label>

          <button
            className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-700 focus:outline-none my-1"
            onClick={handleSubmit}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
