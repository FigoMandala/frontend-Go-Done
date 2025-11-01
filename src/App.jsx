import { useState } from "react";
import axios from "axios";
import wallpaper from './assets/wallpaper.png';
import illustration from './assets/illustration.svg';
import { FaUser, FaLock } from "react-icons/fa";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password
      });

      if (res.data.success) {
        alert("Login berhasil!");
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
      } else {
        alert("Login gagal!");
      }
    } catch (err) {
      alert("Email atau password salah!");
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#21596A] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-[#21569A]/60"></div>

      <div
        className="
          relative z-10 bg-white rounded-2xl shadow-2xl
          flex flex-col lg:flex-row items-center justify-between
          w-[90%] max-w-[1300px]
          min-h-[650px] lg:min-h-[700px]
          overflow-hidden
        "
      >
        {/* Form login */}
        <form onSubmit={handleSubmit} className="w-full lg:w-1/2 flex flex-col justify-center px-10 lg:px-16 py-12">
          <h1 className="text-[46px] font-semibold text-gray-800 mb-8 -mt-24">Sign In</h1>

          <div className="space-y-4">
            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <FaUser className="text-gray-500 mr-3" />
              <input
                type="email"
                placeholder="Enter Email"
                className="flex-1 outline-none text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center border border-gray-400 rounded-md px-4 py-3">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                placeholder="Enter Password"
                className="flex-1 outline-none text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#21569A] text-white px-6 py-2 mt-8 rounded-md font-semibold hover:bg-[#1B4B59] w-32 transition-all"
          >
            Submit
          </button>
        </form>

        {/* Ilustrasi */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <img src={illustration} alt="Login Illustration" className="w-[80%] max-w-[700px] object-contain" />
        </div>
      </div>
    </div>
  );
}

export default App;
