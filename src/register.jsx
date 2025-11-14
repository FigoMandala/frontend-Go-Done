import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import wallpaper from "./assets/wallpaper.png";
import illustration from "./assets/Registrasi.svg";
import { FaUser, FaLock, FaRegUser } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

function Register() {
  // State untuk semua input
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.dismiss();

    const { firstName, lastName, username, email, password, confirmPassword } =
      formData;

    // 🔹 Validasi sederhana
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Email tidak valid!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    // 🔹 Kirim data ke backend
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
      });

      if (res.data.success) {
        toast.success("Registrasi berhasil!");
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(res.data.message || "Registrasi gagal!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat registrasi!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#21596A] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "18px",
            padding: "16px 24px",
            borderRadius: "10px",
          },
          error: {
            style: {
              background: "#ffffff",
              color: "black",
            },
          },
          success: {
            style: {
              background: "#ffffff",
              color: "black",
            },
          },
        }}
      />

      <div className="absolute inset-0 bg-[#21569A]/60"></div>

      <div
        className="
          relative z-10 bg-white rounded-2xl shadow-2xl
          flex flex-col lg:flex-row 
          items-start justify-between
          w-[90%] max-w-[1300px]
          min-h-[650px] lg:min-h-[700px]
          overflow-hidden
          p-6
        "
      >
        {/* FORM REGISTER */}
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-1/2 flex flex-col justify-start px-10 lg:px-16 py-12"
        >
          {/* Header */}
          <h1 className="text-[46px] font-semibold text-gray-800 mb-8">
            SIGN UP
          </h1>

          {/* Input Fields */}
          <div className="space-y-4">
            {/* First Name */}
            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <FaRegUser className="text-gray-500 mr-3" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            {/* Last Name */}
            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <FaRegUser className="text-gray-500 mr-3" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            {/* Username */}
            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <FaUser className="text-gray-500 mr-3" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <MdOutlineMail className="text-gray-500 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="flex-1 outline-none text-gray-700"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 bg-[#21569A] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#1B4B59] w-32 transition-all"
          >
            Register
          </button>
        </form>

        {/* ILUSTRASI */}
        <div className="w-full lg:w-1/2 flex justify-center items-start p-8 pt-24 lg:pt-32">
          <img
            src={illustration}
            alt="Register Illustration"
            className="w-[75%] max-w-[700px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
