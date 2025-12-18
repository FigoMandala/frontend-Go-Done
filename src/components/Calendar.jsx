import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiMaximize2, FiMinimize2, FiCheck } from "react-icons/fi";
import backend from "../api/backend";

// ============================================================
// MAIN CALENDAR COMPONENT
// ============================================================
function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  // SUCCESS POPUP
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // BACKEND TASK DATA
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Day Selection State
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  // View Mode: "all" or "selected"
  const [viewMode, setViewMode] = useState("all");

  // Fetch tasks - filter completed tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await backend.get("/tasks");

        const parsed = res.data
          .filter((t) => t.status !== "completed")
          .map((t) => {
            const deadline = (t.deadline || "").trim();
            
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

  const getEventsForDay = (day) => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return tasks.filter((task) => {
      if (!task.deadline || !task.title || !task.title.trim()) return false;

      const parts = task.deadline.split("-");
      if (parts.length !== 3) return false;

      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const dayNum = parseInt(parts[2], 10);

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
    setViewMode("selected"); // Switch to selected view
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
            {/* HEADER - TAB BUTTONS */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setViewMode("all")}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-[#21569A] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setViewMode("selected")}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "selected"
                    ? "bg-[#21569A] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Selected
              </button>
            </div>

            {/* SELECTED DATE HEADER */}
            {viewMode === "selected" && selectedDay && (
              <div className="mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-800">
                  {new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </h3>
              </div>
            )}

            {/* TASK LIST */}
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 mb-6">
              {loading ? (
                <div className="text-center text-gray-500 py-6">Loading...</div>
              ) : viewMode === "all" ? (
                // ALL TASKS VIEW
                validTasks.length === 0 ? (
                  <div className="text-center text-gray-500 py-6">No Tasks</div>
                ) : (
                  (() => {
                    // Group by date
                    const grouped = {};
                    validTasks.forEach(task => {
                      const date = task.deadline;
                      if (!grouped[date]) grouped[date] = [];
                      grouped[date].push(task);
                    });

                    // Sort dates
                    const sortedDates = Object.keys(grouped).sort();

                    return sortedDates.map(date => {
                      const tasks = grouped[date];
                      const dateObj = new Date(date + "T00:00:00");
                      const formattedDate = dateObj.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      });

                      return (
                        <div key={date} className="mb-4">
                          {/* DATE HEADER */}
                          <h4 className="text-sm font-bold text-gray-800 mb-2">
                            {formattedDate}
                          </h4>

                          {/* TASKS FOR THIS DATE */}
                          <div className="space-y-2">
                            {tasks.map(task => (
                              <div
                                key={task.id}
                                className={`p-3 rounded-lg border-l-4 ${getPriorityColor(
                                  task.priority
                                )}`}
                              >
                                <p className="text-sm font-semibold mb-1">
                                  {task.title}
                                </p>
                                <p className="text-xs">
                                  {task.deadline} <span className={
                                    task.priority === "high"
                                      ? "text-red-600 font-semibold"
                                      : task.priority === "medium"
                                      ? "text-yellow-600 font-semibold"
                                      : "text-green-600 font-semibold"
                                  }>
                                    {task.priority} Priority
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()
                )
              ) : (
                // SELECTED EVENTS VIEW
                selectedEvents.length === 0 ? (
                  <div className="text-center text-gray-500 py-6">
                    {selectedDay 
                      ? "No tasks on this date"
                      : "Click a date to view tasks"}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedEvents.map(task => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border-l-4 ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        <p className="text-sm font-semibold mb-1">
                          {task.title}
                        </p>
                        <p className="text-xs">
                          {task.deadline} <span className={
                            task.priority === "high"
                              ? "text-red-600 font-semibold"
                              : task.priority === "medium"
                              ? "text-yellow-600 font-semibold"
                              : "text-green-600 font-semibold"
                          }>
                            {task.priority} Priority
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )
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