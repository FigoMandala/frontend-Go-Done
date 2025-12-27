import React, { useEffect, useState } from "react";
import backend from "../api/backend";
import EditTaskForm from "./EditTaskForm";
import { FaPen, FaTrashAlt, FaCheck } from "react-icons/fa";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizePriority = (p) => {
  if (!p) return "";
  const x = p.toString().trim().toLowerCase();
  if (x === "high") return "High";
  if (x === "medium") return "Medium";
  if (x === "low") return "Low";
  return p;
};

// Priority configurations
const PRIORITY_CONFIG = {
  High: { border: "border-red-500", text: "text-red-600", title: "High Priority" },
  Medium: { border: "border-yellow-500", text: "text-yellow-600", title: "Medium Priority" },
  Low: { border: "border-green-500", text: "text-green-600", title: "Low Priority" }
};

// --- Task Card ---
const TaskCard = ({ task, onEdit, onDelete, onDone }) => {
  const priority = normalizePriority(task.priority);
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Low;

  return (
    <div className={`bg-gray-50 p-4 rounded-lg border-l-4 ${config.border}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-gray-800">{task.title}</p>
          <p className="text-xs text-gray-500">{task.category_name}</p>
          <p className={`text-xs font-medium ${config.text}`}>
            Due: {formatDate(task.deadline)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaPen
            className="cursor-pointer text-blue-500 hover:text-blue-700 text-xs"
            onClick={() => onEdit(task)}
          />
          <FaTrashAlt
            className="cursor-pointer text-red-500 hover:text-red-700 text-xs"
            onClick={() => onDelete(task.task_id)}
          />
          <FaCheck
            className="cursor-pointer text-green-500 hover:text-green-700 text-xs"
            onClick={() => onDone(task.task_id)}
          />
        </div>
      </div>
    </div>
  );
};

// --- Priority Column ---
const PriorityColumn = ({ priority, tasks, onEdit, onDelete, onDone }) => {
  const config = PRIORITY_CONFIG[priority];
  
  return (
    <div className={`bg-white rounded-xl shadow-lg border-t-8 ${config.border}`}>
      <div className="p-4">
        <h3 className={`font-semibold text-lg ${config.text}`}>{config.title}</h3>
      </div>
      <div className="space-y-4 px-4 pb-4">
        {tasks.length === 0 && (
          <p className="text-sm text-gray-500">No {priority.toLowerCase()} priority tasks.</p>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.task_id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDone={onDone}
          />
        ))}
      </div>
    </div>
  );
};

// --- Popup ---
const Popup = ({ show, type, message, onClose }) => {
  if (!show) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-500" : "bg-red-500";
  const title = isSuccess ? "Success!" : "Error";
  const titleColor = isSuccess ? "text-gray-800" : "text-red-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        {isSuccess && (
          <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <FaCheck className="text-white w-8 h-8" />
          </div>
        )}
        <h2 className={`text-${isSuccess ? '2' : ''}xl font-bold ${titleColor} mb-2`}>{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-2 rounded-lg"
        >
          {isSuccess ? "OK" : "Close"}
        </button>
      </div>
    </div>
  );
};

function TaskPriorities() {
  const [tasks, setTasks] = useState({ High: [], Medium: [], Low: [] });
  const [categories, setCategories] = useState([]);
  
  // Form states
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Popup state
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
  };

  const fetchTasks = async () => {
    try {
      const [catRes, taskRes] = await Promise.all([
        backend.get("/categories"),
        backend.get("/tasks"),
      ]);

      // Set categories
      const catOpts = (catRes.data || []).map((c) => ({
        value: c.category_id,
        label: c.category_name,
      }));
      setCategories(catOpts);

      // Group tasks by priority
      const tasksByPriority = { High: [], Medium: [], Low: [] };
      taskRes.data.forEach((t) => {
        if (t.status === 'completed') return;
        const priority = normalizePriority(t.priority);
        if (tasksByPriority[priority]) {
          tasksByPriority[priority].push({ ...t, priority });
        }
      });
      
      setTasks(tasksByPriority);
    } catch (err) {
      console.error("Error loading tasks", err);
    }
  };

  const handleEdit = (task) => {
    const taskData = {
      id: task.task_id,
      title: task.title,
      categoryId: task.category_id,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
      status: task.status,
    };
    setEditingTask(taskData);
    setShowEditForm(true);
  };

  const handleSaveEdit = async (formData) => {
    try {
      await backend.put(`/tasks/${editingTask.id}`, formData);
      setShowEditForm(false);
      setEditingTask(null);
      showPopup("success", "Task updated successfully!");
      await fetchTasks();
    } catch (err) {
      showPopup("error", err.response?.data?.error || "Failed to update task");
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingTask(null);
  };

  const handleDelete = async (taskId) => {
    try {
      await backend.delete(`/tasks/${taskId}`);
      showPopup("success", "Task deleted successfully!");
      fetchTasks();
    } catch (err) {
      showPopup("error", err.response?.data?.error || "Failed to delete task");
    }
  };

  const handleDone = async (taskId) => {
    try {
      await backend.put(`/tasks/${taskId}`, { status: "completed" });
      showPopup("success", "Task marked as done!");
      fetchTasks();
    } catch (err) {
      showPopup("error", err.response?.data?.error || "Failed to complete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      {/* Edit Form Modal */}
      <EditTaskForm
        isOpen={showEditForm}
        isEditMode={true}
        task={editingTask}
        categories={categories}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onAddCategory={() => {}}
        onEditCategory={() => {}}
        onDeleteCategory={() => {}}
      />

      {/* Popup */}
      <Popup
        show={popup.show}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ show: false, type: "", message: "" })}
      />

      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-gray-800 pl-6 pt-6">
          Task Priorities
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["High", "Medium", "Low"].map((priority) => (
            <PriorityColumn
              key={priority}
              priority={priority}
              tasks={tasks[priority]}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDone={handleDone}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default TaskPriorities;