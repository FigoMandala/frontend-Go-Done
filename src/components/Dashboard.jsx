  import { useEffect, useState } from "react";
  import axios from "axios";
  import { FiEdit2, FiTrash2 } from "react-icons/fi";

  function Dashboard() {

    const [user, setUser] = useState({});
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Token tidak ditemukan!");
        return;
      }

      axios
        .get("http://127.0.0.1:8000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log("Error GET /me:", err);
        });
    }, []);

    // Tentukan greeting sesuai waktu
    useEffect(() => {
      const now = new Date();
      const hour = now.getHours();

      if (hour >= 4 && hour < 11) {
        setGreeting("Good Morning");
      } else if (hour >= 11 && hour < 15) {
        setGreeting("Good Afternoon");
      } else if (hour >= 15 && hour < 19) {
        setGreeting("Good Evening");
      } else {
        setGreeting("Good Night");
      }
    }, []);

  return (
    <div className="flex flex-col gap-6">

      {/* GREETING */}
      <h1 className="text-2xl font-semibold text-gray-800 pl-6 pt-6">
        Hello, {greeting} {user?.first_name}!
      </h1>

      {/* 2. KONTEN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DEADLINE */}
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
        
        {/* SCHEDULE */}
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

        {/* TASK PRIORITIES */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
           <h2 className="font-bold text-xl mb-4">Task Priorities</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <p className="font-normal">High Priority</p>
                </div>
                <p className="text-red-600 text-sm font-semibold">4 tasks</p>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                  <p className="font-normal">Medium Priority</p>
                </div>
                <p className="text-yellow-600 text-sm font-semibold">2 tasks</p>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <p className="font-normal">Low Priority</p>
                </div>
                <p className="text-green-600 text-sm font-semibold">3 tasks</p>
              </div>
            </div>
        </div>

        {/* MY TASK */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
           <h2 className="font-bold text-xl mb-4">My Task</h2>
           <div className="space-y-3">

             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
               <div className="flex items-center gap-3">
                 <input type="checkbox" className="w-5 h-5" />
                 <p className="font-semibold">Kuis 7 Jaringan Komputer</p>
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

             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
               <div className="flex items-center gap-3">
                 <input type="checkbox" className="w-5 h-5" />
                 <p className="font-semibold">Tugas 5 IMPAL</p>
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

             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
               <div className="flex items-center gap-3">
                 <input type="checkbox" className="w-5 h-5" />
                 <p className="font-semibold">Kuis 7 Keamanan Siber</p>
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

           </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
