import { FaHome, FaTasks, FaFlag, FaCalendar, FaSignOutAlt } from "react-icons/fa";
import { FaBell, FaSearch } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import logoGoDone from "../assets/GoDone Logo.png";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  // AMBIL USER DARI LOCALSTORAGE
  const user = JSON.parse(localStorage.getItem("user"));

  const profileName = user ? `${user.first_name} ${user.last_name}` : "User";
  const profileImage = user?.profileImage || "https://i.pravatar.cc/80";

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-[#21569A] text-white rounded-xl shadow-lg flex flex-col p-4 overflow-y-auto">
        
        {/* Profile Section */}
        <div className="p-4 flex items-center gap-3 border-b border-[#21569A] mb-4">
          <img src={profileImage} className="rounded-full w-12 h-12" alt="Profile" />
          <div>
            <p className="font-semibold">{profileName}</p>
            <span className="text-sm opacity-70">Tap to open settings</span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2">
          <a className="flex items-center gap-3 bg-white text-[#21569A]/90 font-semibold px-4 py-3 rounded-lg" href="#">
            <FaHome /> Dashboard
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-[#21569A]/90" href="#">
            <FaTasks /> My Task
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-[#21569A]/90" href="#">
            <FaFlag /> Task Priorities
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-[#21569A]/90" href="#">
            <FaCalendar /> Calendar
          </a>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-4 border-t border-blue-700 hover:bg-blue-800 flex items-center gap-3 rounded-b-lg" href="#">
            <FaSignOutAlt /> Log Out
        </button>
        </aside>

      {/* ===== CONTENT ===== */}
      <div className="flex-1 flex flex-col">

        {/* ===== TOPBAR ===== */}
        <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
          <img src={logoGoDone} alt="GoDone Logo" className="h-7 w-auto" />

          <div className="flex items-center gap-4">
            <input className="px-4 py-2 bg-gray-100 rounded-lg w-[550px] shadow-lg" placeholder="Search..." />
            <button className="p-3 bg-[#21569A] text-white rounded-lg shadow-2xl">
              <FaSearch />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="p-3 bg-[#21569A] text-white rounded-lg cursor-pointer shadow-lg">
              <FaBell />
            </div>
            <div className="flex flex-col text-sm text-right">
              <span className="font-semibold">Tuesday</span>
              <span className="opacity-70">28/10/2025</span>
            </div>
          </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <div className="p-8 flex-1 flex flex-col gap-6 overflow-y-auto">

          <h1 className="text-2xl font-semibold text-gray-800">
            Hello, Good Morning {user?.first_name || "User"}!
          </h1>

          {/* GRID CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ===== Deadline ===== */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="font-bold text-xl mb-4">Deadline</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div>
                    <p className="font-normal">Kuis 7 Jaringan Komputer</p>
                    <p className="text-gray-600/70 text-sm">Due: Tomorrow</p>
                  </div>
                  <span className="text-red-600 font-semibold">High</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <div>
                    <p className="font-normal">Kuis 7 Keamanan Siber</p>
                    <p className="text-gray-600/70 text-sm">Due: Friday</p>
                  </div>
                  <span className="text-yellow-600 font-semibold">Medium</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <div>
                    <p className="font-normal">Tugas 5 IMPAL</p>
                    <p className="text-gray-600/70 text-sm">Due: Sunday</p>
                  </div>
                  <span className="text-green-600 font-semibold">Low</span>
                </div>
              </div>
            </div>

            {/* ===== Schedule ===== */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="font-bold text-xl mb-4">Schedule Today</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-normal">Kecerdasan Artifisial</p>
                    <p className="text-gray-600/70 text-sm">KU3.05.15</p>
                  </div>
                  <span className="text-blue-600 font-semibold">09.30 WIB</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-normal">Interaksi Manusia Komputer</p>
                    <p className="text-gray-600/70 text-sm">KU3.04.02</p>
                  </div>
                  <span className="text-blue-600 font-semibold">13.30 WIB</span>
                </div>
              </div>
            </div>

            {/* ===== Priorities ===== */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="font-bold text-xl mb-4">Task Priorities</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <p>High Priority</p>
                  </div>
                  <p className="text-red-600 text-sm font-semibold">4 tasks</p>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <p>Medium Priority</p>
                  </div>
                  <p className="text-yellow-600 text-sm font-semibold">2 tasks</p>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <p>Low Priority</p>
                  </div>
                  <p className="text-green-600 text-sm font-semibold">3 tasks</p>
                </div>
              </div>
            </div>

            {/* ===== My Task ===== */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="font-bold text-xl mb-4">My Task</h2>

              <div className="space-y-3">
                {["Kuis 7 Jaringan Komputer", "Tugas 5 IMPAL", "Kuis 7 Keamanan Siber"].map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5" />
                      <p className="font-semibold">{task}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <FiEdit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <FiTrash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
