import { useEffect, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import logoGoDone from '../assets/GoDone Logo.png';

function Topbar() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
     const timer = setInterval(() => {
       setDateTime(new Date());
     }, 1000); // update tiap detik

     return () => clearInterval(timer);
  }, []);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[dateTime.getDay()];

  const formattedDate = dateTime.toLocaleDateString("en-GB"); // dd/mm/yyyy
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      
      <img 
        src={logoGoDone} 
        alt="GoDone Logo" 
        className="h-7 w-auto"
      />

      <div className="flex items-center gap-6">
        <div className="p-3 bg-[#21569A] text-white rounded-lg cursor-pointer shadow-lg">
          <FaBell />
        </div>

        {/* Day + Date + Time */}
        <div className="flex flex-col text-sm text-right leading-tight">
          <span className="font-semibold">{dayName}</span>
          <span className="opacity-70">{formattedDate}</span>
          <span className="opacity-50 text-xs">{formattedTime}</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
