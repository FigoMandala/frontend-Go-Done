import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiClock, FiCalendar, FiCheckCircle, FiAlertTriangle, FiCheck } from "react-icons/fi";
import backend from "../api/backend";

function Dashboard() {
  const [user, setUser] = useState({});
  const [greeting, setGreeting] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Delete Popup States
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  
  // Success/Error Popup States
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token tidak ditemukan!");
      return;
    }

    backend
      .get("/user/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log("Error GET /me:", err);
      });
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await backend.get("/tasks");

        const parsed = res.data
          .filter((t) => t.status !== "completed") // Filter out completed tasks
          .map((t) => {
            const deadline = (t.deadline || "").trim();
            
            return {
              id: t.task_id,
              category: t.category_name,
              categoryId: t.category_id,
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

  // Set greeting based on time
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

  // Helper functions
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 border-red-500 text-red-600";
      case "medium":
        return "bg-yellow-50 border-yellow-500 text-yellow-600";
      case "low":
        return "bg-green-50 border-green-500 text-green-600";
      default:
        return "bg-blue-50 border-blue-500 text-blue-600";
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse deadline as YYYY-MM-DD without timezone conversion
    const [year, month, day] = deadline.split("-").map(Number);
    const deadlineDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const formatDeadlineText = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    
    if (days === null) return "No deadline";
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days <= 7) return `${days} days left`;
    
    // Parse deadline as YYYY-MM-DD without timezone conversion
    const [year, month, day] = deadline.split("-").map(Number);
    const deadlineDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    
    return deadlineDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getOverdueText = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    
    if (days === null || days >= 0) return "";
    
    const overdueDays = Math.abs(days);
    if (overdueDays === 1) return "1 day overdue";
    return `${overdueDays} days overdue`;
  };

  const normalizeDate = (str) => {
    if (!str) return "";
    if (str.includes("T")) return str.split("T")[0];
    return str;
  };

  // Filter tasks
  const upcomingTasks = tasks
    .filter((t) => {
      const days = getDaysUntilDeadline(t.deadline);
      return days !== null && days >= 0 && days <= 7;
    })
    .sort((a, b) => {
      const daysA = getDaysUntilDeadline(a.deadline);
      const daysB = getDaysUntilDeadline(b.deadline);
      return daysA - daysB;
    })
    .slice(0, 5);

  const todayTasks = tasks.filter((t) => {
    const days = getDaysUntilDeadline(t.deadline);
    return days === 0;
  });

  // Overdue tasks - only incomplete tasks that are past deadline
  const overdueTasks = tasks
    .filter((t) => {
      const days = getDaysUntilDeadline(t.deadline);
      return days !== null && days < 0 && t.status !== "completed";
    })
    .sort((a, b) => {
      const daysA = getDaysUntilDeadline(a.deadline);
      const daysB = getDaysUntilDeadline(b.deadline);
      return daysA - daysB; // Most overdue first
    })
    .slice(0, 5);

  const priorityCounts = {
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  };

  // CRUD Handlers (dari MyTask.jsx)
  
  // Handle Edit Task
  const handleEditTask = (task) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: normalizeDate(task.deadline),
      priority: task.priority,
      categoryId: task.categoryId
    });
    setShowEditModal(true);
  };

  // Handle Update Task
  const handleUpdateTask = async () => {
    if (!editingTask.title.trim()) {
      setErrorMessage("Task title is required!");
      setShowErrorPopup(true);
      return;
    }

    try {
      const payload = {
        category_id: editingTask.categoryId,
        title: editingTask.title.trim(),
        description: editingTask.description?.trim() || "",
        deadline: normalizeDate(editingTask.deadline),
        priority: editingTask.priority,
        status: "pending",
      };

      await backend.put(`/tasks/${editingTask.id}`, payload);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: payload.title,
                description: payload.description,
                priority: payload.priority,
                deadline: payload.deadline,
              }
            : t
        )
      );

      setShowEditModal(false);
      setEditingTask(null);
      setPopupMessage("Task updated successfully!");
      setShowSuccessPopup(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to update task");
      setShowErrorPopup(true);
    }
  };

  // Handle Delete Click
  const handleDeleteClick = (taskId) => {
    setDeleteTaskId(taskId);
    setShowDeletePopup(true);
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    try {
      await backend.delete(`/tasks/${deleteTaskId}`);
      
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId));
      
      setShowDeletePopup(false);
      setDeleteTaskId(null);
      setPopupMessage("Task deleted successfully!");
      setShowSuccessPopup(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to delete task");
      setShowErrorPopup(true);
    }
  };

  // Handle Complete Task
  const handleFinishTask = async (taskId) => {
    try {
      await backend.put(`/tasks/${taskId}`, {
        status: "completed",
      });

      // Remove task from list after completion
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      setPopupMessage("Task marked as completed!");
      setShowSuccessPopup(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to complete task");
      setShowErrorPopup(true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* GREETING */}
        <div className="pl-6 pt-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {greeting}, {user?.first_name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your tasks today</p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* UPCOMING DEADLINES */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="w-5 h-5 text-gray-700" />
              <h2 className="font-bold text-xl">Upcoming Deadlines</h2>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-gray-500 py-8">Loading...</div>
              ) : upcomingTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FiCheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>All caught up! 🎉</p>
                </div>
              ) : (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex justify-between items-center p-4 border-l-4 rounded-lg ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{task.title}</p>
                      <p className="text-sm text-gray-600">
                        {formatDeadlineText(task.deadline)}
                      </p>
                    </div>
                    <span className="ml-3 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                      {task.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TODAY'S TASKS */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="w-5 h-5 text-gray-700" />
              <h2 className="font-bold text-xl">Today's Tasks</h2>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-gray-500 py-8">Loading...</div>
              ) : todayTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No tasks due today</p>
                  <p className="text-sm mt-1">Enjoy your day! ☀️</p>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.category}</p>
                    </div>
                    <span className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                      Due Today
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TASK PRIORITIES */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="font-bold text-xl mb-4">Task Priorities</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <p className="font-semibold">High Priority</p>
                </div>
                <p className="text-red-600 text-lg font-bold">
                  {priorityCounts.high}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <p className="font-semibold">Medium Priority</p>
                </div>
                <p className="text-yellow-600 text-lg font-bold">
                  {priorityCounts.medium}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <p className="font-semibold">Low Priority</p>
                </div>
                <p className="text-green-600 text-lg font-bold">
                  {priorityCounts.low}
                </p>
              </div>
            </div>
          </div>

          {/* OVERDUE TASKS */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-xl text-red-600">Overdue Tasks</h2>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-gray-500 py-8">Loading...</div>
              ) : overdueTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FiCheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>No overdue tasks! 🎊</p>
                  <p className="text-sm mt-1">You're on track!</p>
                </div>
              ) : (
                overdueTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-600 hover:bg-red-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-red-900">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-red-600 font-semibold">
                          {getOverdueText(task.deadline)}
                        </p>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-600 capitalize">
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button 
                        className="p-2 hover:bg-red-200 rounded-lg transition-colors"
                        onClick={() => handleEditTask(task)}
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4 text-red-700" />
                      </button>
                      <button 
                        className="p-2 hover:bg-red-200 rounded-lg transition-colors"
                        onClick={() => handleDeleteClick(task.id)}
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-700" />
                      </button>
                      <button 
                        className="p-2 hover:bg-red-200 rounded-lg transition-colors"
                        onClick={() => handleFinishTask(task.id)}
                        title="Mark as completed"
                      >
                        <FiCheck className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Edit Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                  value={editingTask.description || ""}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Deadline</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingTask.deadline || ""}
                  onChange={(e) => setEditingTask({...editingTask, deadline: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Priority</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                  value={editingTask.priority || ""}
                  onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                onClick={handleUpdateTask}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE POPUP */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Delete Task?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this task?</p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setDeleteTaskId(null);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">{popupMessage}</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-2 rounded-lg font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ERROR POPUP */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;