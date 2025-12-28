// src/components/MyTask.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiPlus } from "react-icons/fi";
import EditTaskForm from "./EditTaskForm";
import backend from "../api/backend";

// Sanitize output to prevent XSS when rendering
const sanitizeOutput = (text) => {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

const priorityBorder = (p) => {
  switch ((p || "").toLowerCase()) {
    case "high": return "border-red-500";
    case "medium": return "border-yellow-500";
    case "low": return "border-green-500";
    default: return "border-gray-300";
  }
};

const normalizeDate = (str) => {
  if (!str) return "";
  return str.includes("T") ? str.split("T")[0] : str;
};

// ========== Reusable Popup Component ==========
const Popup = ({ show, type, title, message, onConfirm, onCancel, confirmText = "OK" }) => {
  if (!show) return null;

  const isSuccess = type === "success";
  const isError = type === "error";
  const isConfirm = type === "confirm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        {isSuccess && (
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-white w-8 h-8" />
          </div>
        )}
        <h2 className={`text-${isSuccess ? '2' : ''}xl font-bold mb-${isSuccess ? '2' : '4'} ${
          isError ? 'text-red-600' : isSuccess ? 'text-gray-800' : 'text-gray-800'
        }`}>
          {title}
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className={`flex gap-4 ${isConfirm ? '' : 'justify-center'}`}>
          {isConfirm ? (
            <>
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
              >
                {confirmText}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onCancel}
              className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-2 rounded-lg"
            >
              {isError ? "Close" : "OK"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== Category Edit Popup ==========
const CategoryEditPopup = ({ show, categoryName, onSave, onCancel }) => {
  const [name, setName] = useState(categoryName);

  useEffect(() => {
    setName(categoryName);
  }, [categoryName]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Category</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-6"
        />
        <div className="flex gap-3">
          <button
            onClick={() => onSave(name)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function MyTask() {
  const [loading, setLoading] = useState(true);
  const [isRequestPending, setIsRequestPending] = useState(false); // Prevent concurrent requests

  // Unified popup state
  const [popup, setPopup] = useState({ 
    show: false, 
    type: "", // success | error | confirm | validation | categoryEdit | categoryDeleteError
    title: "",
    message: "",
    data: null
  });

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Data
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);

  const priorityOptions = useMemo(
    () => [
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ],
    []
  );

  const categoriesMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[String(c.value)] = c.label));
    return map;
  }, [categories]);

  // ========== Helper to show popup ==========
  const showPopup = (type, title, message, data = null) => {
    setPopup({ show: true, type, title, message, data });
  };

  const closePopup = () => {
    setPopup({ show: false, type: "", title: "", message: "", data: null });
  };

  // ========== Fetch initial data ==========
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [catRes, taskRes] = await Promise.all([
          backend.get("/categories"),
          backend.get("/tasks"),
        ]);

        const catOpts = (catRes.data || []).map((c) => ({
          value: c.category_id,
          label: c.category_name,
        }));
        setCategories(catOpts);

        const taskItems = (taskRes.data || []).map((t) => ({
          id: t.task_id,
          categoryId: t.category_id,
          title: t.title,
          description: t.description,
          priority: t.priority,
          deadline: t.deadline,
          status: (t.status || "pending").toLowerCase() === "done" ? "Done" : (t.status || "pending"),
        }));
        setTasks(taskItems);
      } catch (err) {
        showPopup("error", "Error", err.response?.data?.error || "Failed to load data from server");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ========== Category operations ==========
  const handleAddCustomCategory = async (newName) => {
    try {
      const res = await backend.post("/categories", { category_name: newName });
      const newId = res.data?.category_id;
      const newObj = { value: newId, label: newName };
      setCategories((prev) => [...prev, newObj]);
      showPopup("success", "Success!", "Category added");
    } catch (err) {
      showPopup("error", "Error", err.response?.data?.error || "Failed to add category");
    }
  };

  const handleEditCategory = (catId) => {
    const found = categories.find((c) => String(c.value) === String(catId));
    showPopup("categoryEdit", "", "", { id: catId, name: found?.label || "" });
  };

  const handleSaveCategoryEdit = async (newName) => {
    const name = newName.trim();
    if (!name) return;

    const catId = popup.data.id;

    try {
      await backend.put(`/categories/${catId}`, { category_name: name });

      setCategories((prev) =>
        prev.map((c) =>
          String(c.value) === String(catId) ? { ...c, label: name } : c
        )
      );

      closePopup();
      showPopup("success", "Success!", "Category renamed successfully!");
    } catch (err) {
      showPopup("error", "Error", err.response?.data?.error || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      await backend.delete(`/categories/${catId}`);
      setCategories((prev) => prev.filter((c) => String(c.value) !== String(catId)));
      showPopup("success", "Success!", "Category deleted successfully!");
    } catch (err) {
      if (err.response?.status === 400) {
        const found = categories.find((c) => String(c.value) === String(catId));
        showPopup(
          "categoryDeleteError", 
          "Cannot Delete Category", 
          `Category "${found?.label || "this category"}" is used by existing tasks.`
        );
        return;
      }
      showPopup("error", "Error", err.response?.data?.error || "Failed to delete category");
    }
  };

  // ========== Task operations ==========
  const handleSaveTask = async (formData) => {
    // Prevent concurrent requests
    if (isRequestPending) return;
    setIsRequestPending(true);

    try {
      if (isEditMode) {
        // Update
        await backend.put(`/tasks/${editingTaskId}`, formData);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTaskId
              ? {
                  ...t,
                  categoryId: formData.category_id,
                  title: formData.title,
                  description: formData.description,
                  priority: formData.priority,
                  deadline: formData.deadline,
                }
              : t
          )
        );

        showPopup("success", "Success!", "Task updated successfully!");
      } else {
        // Create
        const res = await backend.post("/tasks", formData);
        const newId = res.data?.task_id;

        const newTask = {
          id: newId,
          categoryId: formData.category_id,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          deadline: formData.deadline,
          status: "pending",
        };
        setTasks((prev) => [newTask, ...prev]);

        showPopup("success", "Success!", "You have successfully added a new task!");
      }

      setShowAddForm(false);
      setIsEditMode(false);
      setEditingTaskId(null);
    } catch (err) {
      showPopup("error", "Error", err.response?.data?.error || "Failed to save task");
    } finally {
      setIsRequestPending(false);
    }
  };

  const handleDeleteClick = (taskId) => {
    showPopup("confirm", "Delete Task?", "Are you sure you want to delete this task?", { taskId });
  };

  const handleDeleteConfirm = async () => {
    // Prevent concurrent requests
    if (isRequestPending) return;
    setIsRequestPending(true);

    const taskId = popup.data.taskId;
    try {
      await backend.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      closePopup();
      showPopup("success", "Success!", "Task deleted successfully!");
    } catch (err) {
      showPopup("error", "Error", err.response?.data?.error || "Failed to delete task");
    } finally {
      setIsRequestPending(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setIsEditMode(true);
    setShowAddForm(true);
  };

  const handleFinishTask = async (taskId) => {
    // Prevent concurrent requests
    if (isRequestPending) return;
    setIsRequestPending(true);

    try {
      await backend.put(`/tasks/${taskId}`, { status: "completed" });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "Done" } : t
        )
      );
      showPopup("success", "Success!", "Task marked as completed!");
    } catch (err) {
      showPopup("error", "Error", err.response?.data?.error || "Failed to complete task");
    } finally {
      setIsRequestPending(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setIsEditMode(false);
    setEditingTaskId(null);
  };

  // ========== UI - Add/Edit Form ==========
  if (showAddForm) {
    const taskToEdit = isEditMode ? tasks.find(t => t.id === editingTaskId) : null;
    const formTaskData = taskToEdit ? {
      id: taskToEdit.id,
      title: taskToEdit.title,
      categoryId: taskToEdit.categoryId,
      description: taskToEdit.description,
      priority: taskToEdit.priority,
      deadline: normalizeDate(taskToEdit.deadline),
      status: taskToEdit.status
    } : null;

    return (
      <>
        <EditTaskForm
          isOpen={showAddForm}
          isEditMode={isEditMode}
          task={formTaskData}
          categories={categories}
          onSave={handleSaveTask}
          onCancel={handleCancel}
          onAddCategory={handleAddCustomCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        {/* Category Edit Popup */}
        <CategoryEditPopup
          show={popup.type === "categoryEdit"}
          categoryName={popup.data?.name || ""}
          onSave={handleSaveCategoryEdit}
          onCancel={closePopup}
        />

        {/* Category Delete Error */}
        <Popup
          show={popup.type === "categoryDeleteError"}
          type="error"
          title={popup.title}
          message={popup.message}
          onCancel={closePopup}
        />
      </>
    );
  }

  // ========== UI - Task List ==========
  return (
    <>
      {/* Success/Error Popup */}
      <Popup
        show={popup.type === "success" || popup.type === "error"}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onCancel={closePopup}
      />

      {/* Delete Confirmation */}
      <Popup
        show={popup.type === "confirm"}
        type="confirm"
        title={popup.title}
        message={popup.message}
        onConfirm={handleDeleteConfirm}
        onCancel={closePopup}
        confirmText="Yes, Delete"
      />

      {/* Header + Add Button */}
      <div className="flex justify-between items-center pl-6 pt-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Task</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setIsEditMode(false);
          }}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-lg p-6 mx-6 mt-4">
        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading...</div>
        ) : tasks.filter(task => task.title && task.title.trim()).length === 0 ? (
          <div className="py-6 text-center text-gray-500">No tasks yet.</div>
        ) : (
          <div className="space-y-4">
            {tasks.filter(task => task.title && task.title.trim()).map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-lg border-l-4 transition-all ${
                  (task.status || "").toLowerCase() === "done"
                    ? "bg-gray-100 border-gray-300 opacity-60"
                    : `bg-gray-50 ${priorityBorder(task.priority)} hover:shadow-md`
                }`}
              >
                <div className={(task.status || "").toLowerCase() === "done" ? "opacity-70" : ""}>
                  <p className={`text-sm font-semibold ${
                    (task.status || "").toLowerCase() === "done"
                      ? "text-gray-500 line-through"
                      : "text-gray-800"
                  }`}>
                    {sanitizeOutput(task.title)}
                  </p>
                  <p className={`text-xs ${
                    (task.status || "").toLowerCase() === "done"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}>
                    {sanitizeOutput(categoriesMap[String(task.categoryId)] || "-")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs ${
                    (task.status || "").toLowerCase() === "done"
                      ? "text-gray-400"
                      : "text-blue-600"
                  }`}>
                    Due: {normalizeDate(task.deadline) || "-"}
                  </span>

                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                    title="Edit"
                    disabled={(task.status || "").toLowerCase() === "done"}
                  >
                    <FiEdit2 className={`w-5 h-5 ${
                      (task.status || "").toLowerCase() === "done"
                        ? "text-gray-400"
                        : "text-blue-600"
                    }`} />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(task.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                    title="Delete"
                  >
                    <FiTrash2 className="text-red-600 w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleFinishTask(task.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                    title={(task.status || "").toLowerCase() === "done" ? "Already completed" : "Mark as finished"}
                    disabled={(task.status || "").toLowerCase() === "done"}
                  >
                    <FiCheck className={`w-5 h-5 ${
                      (task.status || "").toLowerCase() === "done"
                        ? "text-gray-400"
                        : "text-green-500"
                    }`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyTask;