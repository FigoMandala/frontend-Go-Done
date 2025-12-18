import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaTasks, FaFlag, FaCalendar, FaSignOutAlt } from "react-icons/fa";
import backend from "../api/backend";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const baseLinkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-[#21569A]/90 hover:text-white transition-all duration-300 hover:translate-x-1 hover:shadow-lg";
  const activeLinkClass =
    "flex items-center gap-3 bg-white text-[#21569A] font-semibold px-4 py-3 rounded-lg shadow-lg transform scale-105 transition-all duration-300";

  useEffect(() => {
    // Trigger animation after mount
    setIsVisible(true);

    backend
      .get("/user/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.log("Error GET /me:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout berhasil!");
    navigate("/");
  };

  return (
    <aside 
      className={`h-full bg-[#21569A] text-white rounded-xl shadow-lg flex flex-col p-4 overflow-y-auto transition-all duration-700 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      }`}
    >
      
      {/* PROFILE */}
      <button
        onClick={() => navigate("/account")}
        className={`pl-1 pt-2 pb-3 flex items-center gap-3 border-b border-white/20 mb-4 text-left hover:opacity-90 transition-all duration-300 hover:scale-105 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
        style={{ transitionDelay: "100ms" }}
      >
        <div className="relative group">
          <img
            src={
              user?.photo_url
                ? `http://127.0.0.1:8000${user.photo_url}`
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8IjqgqQD8US-0D098l2zOj7ot2utQNCJlUw&s"
            }
            className="rounded-full w-12 h-12 object-cover border-2 border-white transition-all duration-300 group-hover:border-4 group-hover:shadow-xl"
            alt="Profile"
          />
          <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
        </div>

        <div>
          <p className="font-semibold">
            {user?.first_name} {user?.last_name}
          </p>
          <span className="text-sm opacity-70">Tap to open settings</span>
        </div>
      </button>

      {/* NAVIGATION */}
      <nav className="pt-1 flex-1 space-y-2">
        {[
          { to: "/dashboard", icon: FaHome, label: "Dashboard", delay: "200ms" },
          { to: "/my-task", icon: FaTasks, label: "My Task", delay: "300ms" },
          { to: "/priorities", icon: FaFlag, label: "Task Priorities", delay: "400ms" },
          { to: "/calendar", icon: FaCalendar, label: "Calendar", delay: "500ms" },
        ].map((item, index) => (
          <div
            key={item.to}
            className={`transition-all duration-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
            style={{ transitionDelay: item.delay }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? activeLinkClass : baseLinkClass
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          </div>
        ))}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className={`p-4 border-t border-white/20 hover:bg-red-600 flex items-center gap-3 rounded-lg w-full text-left cursor-pointer transition-all duration-300 hover:translate-x-1 hover:shadow-lg active:scale-95 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <FaSignOutAlt className="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </aside>
  );
}

export default Sidebar;