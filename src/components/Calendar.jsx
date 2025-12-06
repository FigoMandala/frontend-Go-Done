import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiPlus, FiMaximize2, FiMinimize2, FiCheck, FiChevronDown } from 'react-icons/fi';

// --- KOMPONEN DROPDOWN CUSTOM (SAMA SEPERTI DI MYTASK) ---
const CustomDropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center border rounded-lg p-3 bg-gray-50 transition-all duration-200 
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected || `Choose ${label}...`}
        </span>
        <FiChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>}

      <div className={`absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-300 origin-top ease-out
        ${isOpen ? 'max-h-60 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95'}`}>
        <ul className="py-1">
          {options.map((option, index) => (
            <li 
              key={index}
              onClick={() => { onSelect(option.value); setIsOpen(false); }}
              className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer transition-colors flex items-center justify-between group"
            >
              <span className="group-hover:text-blue-600 font-medium">{option.label}</span>
              {selected === option.value && <FiCheck className="text-blue-600" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA CALENDAR ---
function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 28));
  const [isExpanded, setIsExpanded] = useState(false);
  
  // --- STATE UNTUK FITUR ADD EVENT ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // State Input Form
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  // Handler Create Event
  const handleCreateEvent = () => {
    setShowAddForm(false);      // Tutup Form
    setShowSuccessPopup(true);  // Munculkan Popup Sukses
  };

  // Logic Kalender
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  // Mock Data Event
  const eventsData = [
    { day: 3, title: "Interaksi Manusia Komputer", type: "lab", color: "bg-blue-100 text-blue-700 border-l-4 border-blue-500" },
    { day: 7, title: "Kuis 7 Jaringan Komputer", type: "high", color: "bg-red-100 text-red-700 border-l-4 border-red-500" },
    { day: 15, title: "Kuis 7 Keamanan Siber", type: "medium", color: "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500" },
    { day: 28, title: "Tugas 5 IMPAL Due", type: "low", color: "bg-green-100 text-green-700 border-l-4 border-green-500" },
    { day: 30, title: "Kecerdasan Artifisial", type: "lab", color: "bg-blue-100 text-blue-700 border-l-4 border-blue-500" },
  ];
  const getEventsForDay = (day) => eventsData.filter(e => e.day === day);

  const days = [];
  for (let i = 0; i < firstDayOfMonth(currentDate); i++) days.push(null);
  for (let i = 1; i <= daysInMonth(currentDate); i++) days.push(i);

  // --- TAMPILAN FORM ADD EVENT ---
  if (showAddForm) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in-up">
        <h1 className="text-2xl font-semibold text-gray-800 pl-6 pt-6">Add Event</h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mx-6 mb-6">
          <form className="space-y-6">
            
            {/* Event Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 transition-all duration-300" placeholder="Enter event title" />
            </div>

            {/* Dropdown: Category */}
            <CustomDropdown 
              label="Select Category"
              selected={category}
              onSelect={setCategory}
              options={[
                { label: "IMPAL", value: "IMPAL" },
                { label: "Jaringan Komputer", value: "Jaringan Komputer" },
                { label: "Keamanan Siber", value: "Keamanan Siber" },
                { label: "Kecerdasan Artificial", value: "Kecerdasan Artificial" },
              ]}
            />

            {/* Event Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Event Description</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 transition-all duration-300" placeholder="Enter description" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dropdown: Priority */}
              <CustomDropdown 
                label="Select Priority"
                selected={priority}
                onSelect={setPriority}
                options={[
                  { label: "Low", value: "Low" },
                  { label: "Medium", value: "Medium" },
                  { label: "High", value: "High" },
                ]}
              />

              {/* Date / Deadline */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Choose Date</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 transition-all duration-300" />
              </div>
            </div>

            {/* BUTTONS ACTION */}
            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={handleCreateEvent}
                className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Create Task
              </button>
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- TAMPILAN KALENDER (DEFAULT) ---
  return (
    <div className="relative flex flex-col gap-6">

      {/* --- POPUP SUCCESS --- */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-lg w-full mx-4 animate-scale-in">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-green-200 shadow-lg">
              <FiCheck className="text-white w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
            <p className="text-gray-500/70 mb-6 font-medium">
              You have successfully added a new task!
            </p>
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-10 rounded-lg transition-all shadow-md active:scale-95"
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 pt-6">
        <h1 className="text-2xl font-semibold text-gray-800">Calendar</h1>
        <button 
          onClick={() => setShowAddForm(true)} // BUKA FORM ADD EVENT
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
        >
          <FiPlus className="w-5 h-5" />
          <span className="font-medium">Add Task</span>
        </button>
      </div>

      {/* KONTEN GRID KALENDER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: KALENDER */}
        <div className={`bg-white rounded-xl shadow-lg p-6 relative flex flex-col transition-all duration-300
          ${isExpanded ? 'lg:col-span-3' : 'lg:col-span-2'} 
        `}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{monthName}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition"><FaChevronLeft /></button>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition"><FaChevronRight /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 mb-12">
            {days.map((day, idx) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              return (
                <div key={idx} className={`p-2 rounded-lg flex flex-col items-start justify-start border border-transparent hover:border-blue-200 transition-all ${day === null ? '' : 'bg-gray-50 cursor-pointer'} ${isExpanded ? 'min-h-[120px]' : 'min-h-[80px]'}`}>
                  {day !== null && (
                    <>
                      <span className={`text-sm font-medium ${day === 28 ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>{day}</span>
                      <div className="w-full mt-1 flex flex-col gap-1">
                        {dayEvents.map((ev, i) => (
                          isExpanded ? (
                            <div key={i} className={`text-[10px] p-1 rounded font-semibold truncate w-full shadow-sm ${ev.color}`}>{ev.title}</div>
                          ) : (
                            <div key={i} className={`w-full h-1.5 rounded-full ${ev.type === 'high' ? 'bg-red-400' : ev.type === 'medium' ? 'bg-yellow-400' : ev.type === 'low' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                          )
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute bottom-6 right-6 bg-[#21569A] hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center z-10"
            title={isExpanded ? "Minimize View" : "Maximize View"}
          >
            {isExpanded ? <FiMinimize2 className="w-6 h-6" /> : <FiMaximize2 className="w-6 h-6" />}
          </button>
        </div>

        {/* KOLOM KANAN: SIDEBAR */}
        <div className={`flex flex-col gap-6 ${isExpanded ? 'hidden' : 'flex'} w-full lg:w-auto h-full`}>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event(s)</h3>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs font-semibold text-blue-800">Kecerdasan Artifisial</p>
                <p className="text-[10px] text-gray-600">Oct 30, 2025 • Laboratory & Class</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs font-semibold text-blue-800">Interaksi Manusia Komputer</p>
                <p className="text-[10px] text-gray-600">Nov 3, 2025 • Laboratory & Class</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="text-xs font-semibold text-red-800">Kuis 7 Jaringan Komputer</p>
                <p className="text-[10px] text-gray-600">Nov 7 • High Priority</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="text-xs font-semibold text-yellow-800">Kuis 7 Keamanan Siber</p>
                <p className="text-[10px] text-gray-600">Nov 15 • Medium Priority</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-xs font-semibold text-green-800">Tugas 5 IMPAL</p>
                <p className="text-[10px] text-gray-600">Nov 28 • Low Priority</p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Event Types</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded bg-blue-500"></div><span className="text-xs font-semibold text-gray-700">Laboratory & Class</span></div>
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded bg-red-500"></div><span className="text-xs font-semibold text-gray-700">High Priority Tasks</span></div>
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded bg-yellow-500"></div><span className="text-xs font-semibold text-gray-700">Medium Priority Tasks</span></div>
                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded bg-green-500"></div><span className="text-xs font-semibold text-gray-700">Low Priority Tasks</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Calendar;