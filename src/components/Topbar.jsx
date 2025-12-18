import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logoGoDone from '../assets/GoDone Logo.png';
import backend from "../api/backend";

function Topbar() {
  const [dateTime, setDateTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [tasks, setTasks] = useState([]);
  
  const navigate = useNavigate();

  // Fungsi untuk fetch tasks (digunakan berkali-kali)
  const fetchTasks = async () => {
    try {
      const response = await backend.get("/tasks");

      const processedTasks = response.data
        .filter(t => t.status === 'pending')
        .map(t => ({
          ...t,
          deadline: t.deadline ? t.deadline.split(" ")[0].split("T")[0] : null
        }));

      setTasks(processedTasks);

    } catch (error) {
      console.error("Gagal mengambil notifikasi tasks:", error);
    }
  };

  // 1. Update Jam Realtime
  useEffect(() => {
     const timer = setInterval(() => {
       setDateTime(new Date());
     }, 1000); 
     return () => clearInterval(timer);
  }, []);

  // 2. Fetch Data Tasks - Initial + Polling + Event Listener
  useEffect(() => {
    fetchTasks();

    const interval = setInterval(() => {
      fetchTasks();
    }, 5000); 

    const handleTaskUpdate = () => {
      fetchTasks();
    };

    window.addEventListener('taskUpdated', handleTaskUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('taskUpdated', handleTaskUpdate);
    };
  }, []);

  useEffect(() => {
    if (showNotifications) {
      fetchTasks();
    }
  }, [showNotifications]);

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(deadline);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="text-red-500 font-bold">Overdue</span>;
    if (diffDays === 0) return <span className="text-blue-500 font-bold">Today</span>;
    if (diffDays === 1) return <span className="text-orange-500 font-bold">Tomorrow</span>;
    
    return <span className="text-gray-600">{diffDays} Days left</span>;
  };

  const formatTaskDetail = (dateString, priority) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString("en-GB", { weekday: 'long' });
    const dateFormatted = date.toLocaleDateString("en-GB"); 
    const capitalizedPriority = priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "Normal";

    return `${dayName}, ${dateFormatted} • ${capitalizedPriority} Priority`;
  };

  const getPriorityColor = (priority) => {
    const p = priority ? priority.toLowerCase() : "";
    if (p === 'high') return 'text-red-500';
    if (p === 'medium') return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleViewAllClick = () => {
    navigate("/my-task");
    setShowNotifications(false);
  };

  // --- UI RENDER ---

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = days[dateTime.getDay()];
  const currentFormattedDate = dateTime.toLocaleDateString("en-GB"); 
  const currentFormattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="relative flex justify-between items-center px-8 py-4 bg-white shadow-sm z-50">
      
      <img src={logoGoDone} alt="GoDone Logo" className="h-7 w-auto"/>

      <div className="flex items-center gap-6">
        
        {/* NOTIFICATION BELL */}
        <div className="relative">
          <div 
            className="relative p-3 bg-[#21569A] text-white rounded-lg cursor-pointer shadow-lg hover:bg-[#1a457e] transition"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {tasks.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                {tasks.length}
              </span>
            )}
          </div>

          {/* POPUP DROPDOWN */}
          {showNotifications && (
            <div className="absolute right-0 top-14 w-[400px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100]">
              
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-800">Notifications</h3>
                <button className="text-sm text-gray-400 hover:text-gray-600">Mark all read</button>
              </div>

              <div className="max-h-[300px] overflow-y-auto bg-gray-50">
                {tasks.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                    No active tasks
                  </div>
                ) : (
                  <ul>
                    {tasks.map((task) => (
                      <li key={task.task_id} className="bg-white px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-gray-800 truncate pr-4 text-sm">
                            {task.title}
                          </span>
                          <span className="text-xs whitespace-nowrap bg-gray-100 px-2 py-1 rounded">
                            {getDaysLeft(task.deadline)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          {formatTaskDetail(task.deadline, task.priority)}
                          <span className={`text-[10px] ml-1 ${getPriorityColor(task.priority)}`}>●</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t border-gray-100 py-3 text-center bg-white">
                <button 
                  onClick={handleViewAllClick} 
                  className="text-[#21569A] font-semibold text-sm hover:underline"
                >
                  View all tasks
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CLOCK SECTION */}
        <div className="flex flex-col text-sm text-right leading-tight">
          <span className="font-semibold">{currentDayName}</span>
          <span className="opacity-70">{currentFormattedDate}</span>
          <span className="opacity-50 text-xs">{currentFormattedTime}</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;