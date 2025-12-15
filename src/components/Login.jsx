import { useState } from "react";
import backend from "../api/backend";
import wallpaper from "../assets/wallpaper.png";
import illustration from "../assets/illustration.svg";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // --- 2. HANDLER FUNCTIONS (Harus di dalam function) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.dismiss();

    if (!email) return toast.error("Email tidak boleh kosong!");
    if (!email.includes("@")) return toast.error("Email harus mengandung '@'!");
    if (!password) return toast.error("Password tidak boleh kosong!");

    try {
      console.log("🔄 Testing connection to backend...");
      
      const res = await backend.post("/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        toast.success("Login berhasil!");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Login gagal!");
      }
    } catch (err) {
      console.error("❌ Login Error Details:", {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });
      
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        toast.error("Lagi Tidak Terhubung Ke server coba lagi 😀");
      } else if (err.code === "ECONNABORTED") {
        toast.error("❌ Request timeout - server tidak response");
      } else {
        toast.error("❌ Error: " + (err.message || "Unknown error"));
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#21596A] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-[#21569A]/60"></div>
      <Toaster position="top-center" />

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row items-center justify-between w-[90%] max-w-[1300px] min-h-[650px] lg:min-h-[700px] overflow-hidden">
        
        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full lg:w-1/2 flex flex-col justify-center px-10 lg:px-16 py-12">
          <div className="flex flex-col mb-8 -mt-24">
            <h1 className="text-[46px] font-semibold text-gray-800">Sign In</h1>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <FaUser className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Enter Email"
                className="flex-1 outline-none text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="flex-1 outline-none text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-4">
            <button type="submit" className="bg-[#21569A] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#1B4B59] w-32 transition-all">
              Submit
            </button>

            <p className="mt-4">
              Belum punya akun?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </form>

        {/* Illustration */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <img src={illustration} alt="Login Illustration" className="w-[80%] max-w-[700px] object-contain" />
        </div>
      </div>
    </div>
  );
}

export default Login;