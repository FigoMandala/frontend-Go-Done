import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaTasks, FaFlag, FaCalendar, FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function Sidebar() {
  const navigate = useNavigate();
  const baseLinkClass = "flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-[#21569A]/90 hover:text-white";
  const activeLinkClass = "flex items-center gap-3 bg-white text-[#21569A] font-semibold px-4 py-3 rounded-lg";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout berhasil!");
    navigate("/");
  };

  return (
    <aside className="h-full bg-[#21569A] text-white rounded-xl shadow-lg flex flex-col p-4 overflow-y-auto">
      
      {/* 1. PROFIL */}
      <button
        onClick={() => navigate('/account')}
        className="pl-1 pt-2 pb-3  flex items-center gap-3 border-b border-[#21569A] mb-4 text-left hover:opacity-90"
      >
        <img
          src="https://i.pravatar.cc/80"
          className="rounded-full w-12 h-12"
          alt="Profile"
        />
        <div>
          <p className="font-semibold">Figo Mandala</p>
          <span className="text-sm opacity-70">Tap to open settings</span>
        </div>
      </button>

      {/* 2. NAVIGASI */}
      <nav className="border-t pt-3 flex-1 space-y-2">
        <NavLink 
          to="/dashboard"
          className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}
        >
          <FaHome /> Dashboard
        </NavLink>

        <NavLink 
          to="/my-task"
          className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}
        >
          <FaTasks /> My Task
        </NavLink>
        
        <NavLink 
          to="/priorities"
          className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}
        >
          <FaFlag /> Task Priorities
        </NavLink>

        <NavLink 
          to="/calendar"
          className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}
        >
          <FaCalendar /> Calendar
        </NavLink>
      </nav>

      {/* 3. LOG OUT */}
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