import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaTasks, FaFlag, FaCalendar, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

function Sidebar() {
  const navigate = useNavigate();

  const baseLinkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-[#21569A]/90 hover:text-white";
  const activeLinkClass =
    "flex items-center gap-3 bg-white text-[#21569A] font-semibold px-4 py-3 rounded-lg";

  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token not found!");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.log("Error GET /me:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout berhasil!");
    navigate("/");
  };

  return (
    <aside className="h-full bg-[#21569A] text-white rounded-xl shadow-lg flex flex-col p-4 overflow-y-auto">
      
      {/* PROFILE */}
      <button
        onClick={() => navigate("/account")}
        className="pl-1 pt-2 pb-3 flex items-center gap-3 border-b border-[#21569A] mb-4 text-left hover:opacity-90"
      >
        <img
          src={
            user?.photo_url
              ? `http://127.0.0.1:8000${user.photo_url}`
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8IjqgqQD8US-0D098l2zOj7ot2utQNCJlUw&s"
          }
          className="rounded-full w-12 h-12 object-cover border-2 border-white"
          alt="Profile"
        />

        <div>
          <p className="font-semibold">
            {user?.first_name} {user?.last_name}
          </p>
          <span className="text-sm opacity-70">Tap to open settings</span>
        </div>
      </button>

      {/* NAVIGATION */}
      <nav className="border-t pt-3 flex-1 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? activeLinkClass : baseLinkClass
          }
        >
          <FaHome /> Dashboard
        </NavLink>

        <NavLink
          to="/my-task"
          className={({ isActive }) =>
            isActive ? activeLinkClass : baseLinkClass
          }
        >
          <FaTasks /> My Task
        </NavLink>

        <NavLink
          to="/priorities"
          className={({ isActive }) =>
            isActive ? activeLinkClass : baseLinkClass
          }
        >
          <FaFlag /> Task Priorities
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            isActive ? activeLinkClass : baseLinkClass
          }
        >
          <FaCalendar /> Calendar
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="p-4 border-t border-blue-700 hover:bg-blue-800 flex items-center gap-3 rounded-b-lg w-full text-left cursor-pointer transition"
      >
        <FaSignOutAlt /> Log Out
      </button>
    </aside>
  );
}

export default Sidebar;
