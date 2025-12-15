import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiPlus, FiMaximize2, FiMinimize2, FiCheck, FiChevronDown } from "react-icons/fi";
import backend from "../api/backend";

// ============================================================
// CUSTOM DROPDOWN
// ============================================================
const CustomDropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center border rounded-lg p-3 bg-gray-50 transition-all duration-200 
          ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300 hover:border-gray-400"}`}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected || `Choose ${label}...`}
        </span>
        <FiChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
      )}

      {/* dropdown list */}
      <div
        className={`absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-300 origin-top ease-out
        ${isOpen ? "max-h-60 opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-95"}`}
      >
        <ul className="py-1">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer transition-colors flex items-center justify-between group"
            >
              <span className="group-hover:text-blue-600 font-medium">
                {option.label}
              </span>
              {selected === option.value && <FiCheck className="text-blue-600" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ============================================================
// MAIN CALENDAR COMPONENT
// ============================================================
function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  // Add Task Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  // BACKEND TASK DATA
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Day Popup State
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showDayPopup, setShowDayPopup] = useState(false);

  // Fetch tasks - filter completed tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await backend.get("/tasks");

        const parsed = res.data
          .filter((t) => t.status !== "completed") // Filter out completed tasks
          .map((t) => {
            // Backend mengirim deadline sebagai string YYYY-MM-DD
            // Jangan parse dengan Date object karena bisa timezone shift
            const deadline = (t.deadline || "").trim();
            
            console.log(`[CALENDAR] Task: ${t.title}, Deadline: "${deadline}"`);
            
            return {
              id: t.task_id,
              category: t.category_name,
              title: t.title,
              description: t.description,
              deadline: deadline,
              priority: t.priority?.toLowerCase(),
              status: t.status,
            };
          });

        setTasks(parsed);
      } catch (e) {
        console.error("Error fetching tasks:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // priority color helpers
  const getPriorityColor = (p) => {
    if (!p) return "bg-blue-100 border-blue-500 text-blue-700";

    switch (p.toLowerCase()) {
      case "high":
        return "bg-red-100 border-red-500 text-red-700";
      case "medium":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "low":
        return "bg-green-100 border-green-500 text-green-700";
      default:
        return "bg-blue-100 border-blue-500 text-blue-700";
    }
  };

  const getPriorityDot = (p) => {
    switch (p?.toLowerCase()) {
      case "high":
        return "bg-red-400";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-green-400";
      default:
        return "bg-blue-400";
    }
  };

  // event handler
  const handleCreateEvent = () => {
    setShowAddForm(false);
    setShowSuccessPopup(true);
  };

  // calendar logic
  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );

  // Group events by day - filter valid tasks only
  const getEventsForDay = (day) => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return tasks.filter((task) => {
      // Filter out tasks with no deadline or no title
      if (!task.deadline || !task.title || !task.title.trim()) return false;

      // Parse deadline: YYYY-MM-DD format
      const parts = task.deadline.split("-");
      if (parts.length !== 3) {
        console.warn(`Invalid deadline format: "${task.deadline}" for task "${task.title}"`);
        return false;
      }

      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const dayNum = parseInt(parts[2], 10);

      // Debug log
      console.log(`Task: ${task.title}, Deadline: ${task.deadline}, Parsed: ${year}-${month}-${dayNum}, Current: ${currentYear}-${currentMonth}-${day}, Match: ${dayNum === day && month === currentMonth && year === currentYear}`);

      return dayNum === day && month === currentMonth && year === currentYear;
    });
  };

  // Fill empty days
  const days = [];
  for (let i = 0; i < firstDayOfMonth(currentDate); i++) days.push(null);
  for (let i = 1; i <= daysInMonth(currentDate); i++) days.push(i);

  // Filter valid tasks for sidebar display
  const validTasks = tasks.filter(task => task.title && task.title.trim());

  const handleDayClick = (day) => {
    if (!day) return;

    const events = getEventsForDay(day);
    setSelectedDay(day);
    setSelectedEvents(events);
    setShowDayPopup(true);
  };

  return (
    <div className="relative flex flex-col gap-6">

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-lg w-full mx-4 animate-scale-in">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-green-200 shadow-lg">
              <FiCheck className="text-white w-8 h-8 stroke-[3]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Congratulations!
            </h2>
            <p className="text-gray-500/70 mb-6 font-medium">
              You have successfully added a new task!
            </p>

            <button
              onClick={() => setShowSuccessPopup(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-10 rounded-lg shadow-md active:scale-95"
            >
              Ok
            </button>
          </div>
        </div>
      )}
        {showDayPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative animate-scale-in">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setShowDayPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              {/* HEADER */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Task(s) on {selectedDay} {monthName}
              </h2>

              {/* NO TASK CASE */}
              {selectedEvents.length === 0 && (
                <p className="text-gray-500 text-center py-6">Gak Ada Tugas Brow.</p>
              )}

              {/* MULTIPLE TASKS LIST */}
              <div className="space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">

                {selectedEvents.map((task, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>

                      {/* Priority Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize 
                          ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Description</p>
                      <p className="text-gray-700">{task.description || "No description"}</p>
                    </div>

                    {/* GRID INFO */}
                    <div className="grid grid-cols-2 gap-4">

                      {/* Category */}
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Category</p>
                        <p className="text-gray-800 font-medium">{task.category}</p>
                      </div>

                      {/* Deadline */}
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Deadline</p>
                        <p className="text-gray-800 font-medium">{task.deadline}</p>
                      </div>

                      {/* Status */}
                      <div className="bg-gray-50 p-4 rounded-xl col-span-2">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
                        <p className="text-gray-800 font-medium capitalize">{task.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CLOSE BUTTON BOTTOM */}
              <button
                onClick={() => setShowDayPopup(false)}
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md active:scale-95"
              >
                Close
              </button>

            </div>
          </div>
        )}
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 pt-6">
        <h1 className="text-2xl font-semibold text-gray-800">Calendar</h1>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL — CALENDAR */}
        <div
          className={`bg-white rounded-xl shadow-lg p-6 relative flex flex-col transition-all
            ${isExpanded ? "lg:col-span-3" : "lg:col-span-2"}
          `}
        >
          {/* MONTH HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{monthName}</h2>

            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* DAYS HEADER */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="text-center font-semibold text-gray-600 py-2"
              >
                {d}
              </div>
            ))}
          </div>

          {/* DAYS GRID */}
          <div className="grid grid-cols-7 gap-2 mb-12">
            {days.map((day, idx) => {
              const events = day ? getEventsForDay(day) : [];

              const hasHigh = events.some((e) => e.priority === "high");
              const hasMedium = events.some((e) => e.priority === "medium");
              const hasLow = events.some((e) => e.priority === "low");

              const bgColor = hasHigh
                ? "bg-red-200 border-red-300"
                : hasMedium
                ? "bg-yellow-100 border-yellow-300"
                : hasLow
                ? "bg-green-100 border-green-300"
                : "bg-gray-50 border-transparent hover:border-blue-200";

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={`
                    p-2 rounded-lg flex flex-col items-start justify-start border transition-all
                    ${day === null ? "cursor-default" : "cursor-pointer"}
                    ${isExpanded ? "min-h-[120px]" : "min-h-[80px]"}
                    ${bgColor}
                  `}
                >
                  {day !== null && (
                    <>
                      {/* DAY NUMBER */}
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm font-medium text-gray-700">
                          {day}
                        </span>

                        {/* PRIORITY DOTS */}
                        <div className="flex gap-1">
                          {hasHigh && <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>}
                          {hasMedium && <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>}
                          {hasLow && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
                        </div>
                      </div>

                      {/* EVENTS PER DAY */}
                      <div className="w-full mt-1 flex flex-col gap-1">
                        {events.map((ev, i) =>
                          isExpanded ? (
                            <div
                              key={i}
                              className={`text-[10px] p-1 rounded font-semibold truncate w-full shadow-sm border-l-4 ${getPriorityColor(
                                ev.priority
                              )}`}
                            >
                              {ev.title}
                            </div>
                          ) : (
                            <div
                              key={i}
                              className={`w-full h-1.5 rounded-full ${getPriorityDot(
                                ev.priority
                              )}`}
                            ></div>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* EXPAND BUTTON */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute bottom-6 right-6 bg-[#21569A] hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg active:scale-95"
          >
            {isExpanded ? (
              <FiMinimize2 className="w-6 h-6" />
            ) : (
              <FiMaximize2 className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* RIGHT SIDEBAR */}
        {!isExpanded && (
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
            {/* TASK LIST FROM BACKEND */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event(s)</h3>

            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 mb-6">
              {loading ? (
                <div className="text-center text-gray-500 py-6">Loading...</div>
              ) : validTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-6">No Tasks</div>
              ) : (
                validTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-l-4 ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    <p className="text-sm font-semibold mb-1 truncate">
                      {task.title}
                    </p>

                    <p className="text-xs text-gray-600">
                      {task.deadline} • {task.priority}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* EVENT TYPES */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Event Types
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span className="text-xs font-semibold text-gray-700">
                    High Priority
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded bg-yellow-500"></div>
                  <span className="text-xs font-semibold text-gray-700">
                    Medium Priority
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span className="text-xs font-semibold text-gray-700">
                    Low Priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;