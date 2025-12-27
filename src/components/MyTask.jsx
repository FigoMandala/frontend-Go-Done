// src/components/MyTask.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiPlus } from "react-icons/fi";
import CustomDropdown from "./CustomDropdown";
import backend from "../api/backend";

const priorityBorder = (p) => {
  switch ((p || "").toLowerCase()) {
    case "high":
      return "border-red-500";
    case "medium":
      return "border-yellow-500";
    case "low":
      return "border-green-500";
    default:
      return "border-gray-300";
  }
};

function MyTask() {
  const [loading, setLoading] = useState(true);

  // Popups umum
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Popups form
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Popups delete task
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  // Popups validation
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // Popups kategori
  const [showCategoryEditPopup, setShowCategoryEditPopup] = useState(false);
  const [showCategoryDeleteErrorPopup, setShowCategoryDeleteErrorPopup] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Form state
  const [taskTitle, setTaskTitle] = useState("");
  const [categoryId, setCategoryId] = useState(""); // ID numeric/string
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState(""); // format: YYYY-MM-DD

  // Data
  const [categories, setCategories] = useState([]); // [{label, value:id}]
  const [tasks, setTasks] = useState([]); // {id, categoryId, title, ...}

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

  // =========================
  // Fetch initial data
  // =========================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [catRes, taskRes] = await Promise.all([
          backend.get("/categories"),
          backend.get("/tasks"),
        ]);

        // categories: [{category_id, category_name}]
        const catOpts = (catRes.data || []).map((c) => ({
          value: c.category_id,
          label: c.category_name,
        }));
        setCategories(catOpts);

        // tasks: filter hanya status "pending"
        const taskItems = (taskRes.data || [])
          .filter((t) => t.status !== "completed")
          .map((t) => ({
            id: t.task_id,
            categoryId: t.category_id, // ID
            title: t.title,
            description: t.description,
            priority: t.priority,
            deadline: t.deadline, // diasumsikan 'YYYY-MM-DD'
            status: t.status || "pending",
          }));
        setTasks(taskItems);
      } catch (err) {
        setErrorMessage(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to load data from server"
        );
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // =========================
  // Category ops (Add/Edit/Delete)
  // =========================
  const handleAddCustomCategory = async (newName) => {
    try {
      const res = await backend.post("/categories", { category_name: newName });
      const newId = res.data?.category_id;
      const newObj = { value: newId, label: newName };
      setCategories((prev) => [...prev, newObj]);
      setCategoryId(newId);
      setPopupMessage("Category added");
      setShowSuccessPopup(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to add category");
      setShowErrorPopup(true);
    }
  };

  const handleEditCategory = (catId) => {
    const found = categories.find((c) => String(c.value) === String(catId));
    setCategoryToEdit(catId);
    setEditedCategoryName(found?.label || "");
    setShowCategoryEditPopup(true);
  };

  const handleSaveCategoryEdit = async () => {
    const name = editedCategoryName.trim();
    if (!name) return;

    try {
      await backend.put(`/categories/${categoryToEdit}`, { category_name: name });

      setCategories((prev) =>
        prev.map((c) =>
          String(c.value) === String(categoryToEdit) ? { ...c, label: name } : c
        )
      );

      // tasks tidak perlu diubah karena pakai categoryId; label dirender via lookup
      setShowCategoryEditPopup(false);
      setPopupMessage("Category renamed successfully!");
      setShowSuccessPopup(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to update category");
      setShowErrorPopup(true);
    }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      await backend.delete(`/categories/${catId}`);
      setCategories((prev) => prev.filter((c) => String(c.value) !== String(catId)));
      if (String(categoryId) === String(catId)) setCategoryId("");
      setPopupMessage("Category deleted successfully!");
      setShowSuccessPopup(true);
    } catch (err) {
      // Soft guard dari backend → 400
      if (err.response?.status === 400) {
        const found = categories.find((c) => String(c.value) === String(catId));
        setCategoryToDelete(found?.label || "this category");
        setShowCategoryDeleteErrorPopup(true);
        return;
      }
      setErrorMessage(err.response?.data?.error || "Failed to delete category");
      setShowErrorPopup(true);
    }
  };

  // =========================
  // Validation
  // =========================
  const validateForm = () => {
    if (!taskTitle.trim()) {
      setValidationMessage("Task title is required!");
      setShowValidationPopup(true);
      return false;
    }
    if (!categoryId) {
      setValidationMessage("Please select a category!");
      setShowValidationPopup(true);
      return false;
    }
    if (!description.trim()) {
      setValidationMessage("Task description is required!");
      setShowValidationPopup(true);
      return false;
    }
    if (!priority) {
      setValidationMessage("Please select a priority!");
      setShowValidationPopup(true);
      return false;
    }
    if (!deadline) {
      setValidationMessage("Please select a deadline!");
      setShowValidationPopup(true);
      return false;
    }
    return true;
  };

  // =========================
  // Task ops (Create/Update/Delete)
  // =========================
  const handleCreateTask = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        category_id: categoryId,
        title: taskTitle.trim(),
        description: description.trim(),
        deadline: normalizeDate(deadline),
        priority,
      };
      const res = await backend.post("/tasks", payload);
      const newId = res.data?.task_id;

      const newTask = { id: newId, categoryId, title: payload.title, description: payload.description, priority, deadline, status: "pending" };
      setTasks((prev) => [newTask, ...prev]);

      resetForm();
      setShowAddForm(false);
      setPopupMessage("You have successfully added a new task!");
      setShowSuccessPopup(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to create task");
      setShowErrorPopup(true);
    }
  };

  const handleUpdateTask = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        category_id: categoryId,
        title: taskTitle.trim(),
        description: description.trim(),
        deadline: normalizeDate(deadline),
        priority,
        status: "pending",
      };
      await backend.put(`/tasks/${editingTaskId}`, payload);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                categoryId,
                title: payload.title,
                description: payload.description,
                priority,
                deadline,
              }
            : t
        )
      );

      resetForm();
      setShowAddForm(false);
      setPopupMessage("Task updated successfully!");
      setShowSuccessPopup(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to update task");
      setShowErrorPopup(true);
    }
  };

  const handleDeleteClick = (taskId) => {
    setDeleteTaskId(taskId);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await backend.delete(`/tasks/${deleteTaskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId));
      setShowDeletePopup(false);
      setPopupMessage("Task deleted successfully!");
      setShowSuccessPopup(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to delete task");
      setShowErrorPopup(true);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setCategoryId(task.categoryId);
    setDescription(task.description);
    setPriority(task.priority);
    setDeadline(normalizeDate(task.deadline));
    setIsEditMode(true);
    setShowAddForm(true);
  };

  const handleFinishTask = async (taskId) => {
    try {
      await backend.put(`/tasks/${taskId}`, {
        status: "completed",
      });

      // Hapus task dari list setelah di-complete
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      setPopupMessage("Task marked as completed!");
      setShowSuccessPopup(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to complete task");
      setShowErrorPopup(true);
    }
  };

  // =========================
  // Helpers
  // =========================
  const resetForm = () => {
    setTaskTitle("");
    setCategoryId("");
    setDescription("");
    setPriority("");
    setDeadline("");
    setEditingTaskId(null);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
  };

  // =========================
  // Format deadline helper
  // =========================
  const formatDeadline = (dateStr) => {
    if (!dateStr) return "-";
    // dateStr format: YYYY-MM-DD
    // Langsung kembalikan karena sudah dalam format yang benar
    return dateStr;
  };

  // =========================
  // Normalize date helper
  // =========================

  const normalizeDate = (str) => {
  if (!str) return "";
  if (str.includes("T")) return str.split("T")[0];
  return str;
};


  // =========================
  // UI — Add/Edit Form
  // =========================
  if (showAddForm) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in-up">
        <h1 className="text-2xl font-semibold text-gray-800 pl-6 pt-6">
          {isEditMode ? "Edit Task" : "Add Task"}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mx-6 mb-6">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 transition"
                placeholder="Enter task title"
              />
            </div>

            {/* Category */}
            <CustomDropdown
              label="Select Category"
              selected={categoryId}
              onSelect={(val) => setCategoryId(val)}
              options={categories}
              allowCustom
              onAddCustom={handleAddCustomCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Task Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:border-blue-500"
                placeholder="Enter description"
              />
            </div>

            {/* Priority / Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomDropdown
                label="Select Priority"
                selected={priority}
                onSelect={setPriority}
                options={priorityOptions}
              />

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Choose Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={isEditMode ? handleUpdateTask : handleCreateTask}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
              >
                {isEditMode ? "Update Task" : "Create Task"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Validation popup */}
        {showValidationPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">Validation Error</h2>
              <p className="text-gray-700 mb-6 font-medium">{validationMessage}</p>
              <button
                onClick={() => setShowValidationPopup(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-10 py-2 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Category Edit Popup */}
        {showCategoryEditPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Category</h2>
              <input
                type="text"
                value={editedCategoryName}
                onChange={(e) => setEditedCategoryName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveCategoryEdit}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowCategoryEditPopup(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Delete Error Popup */}
        {showCategoryDeleteErrorPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
              <h2 className="text-xl font-bold text-red-600 mb-3">Cannot Delete Category</h2>
              <p className="text-gray-700 mb-6">
                Category <b>{categoryToDelete}</b> is used by existing tasks.
              </p>
              <button
                onClick={() => setShowCategoryDeleteErrorPopup(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================
  // UI — Task List
  // =========================
  return (
    <>
      {/* Success Popup */}
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Task Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Delete Task?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this task?</p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                className={`flex items-center justify-between p-4 rounded-lg border-l-4 bg-gray-50 ${priorityBorder(task.priority)} hover:shadow-md transition-all`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    {categoriesMap[String(task.categoryId)] || "-"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-blue-600">Due: {formatDeadline(task.deadline)}</span>

                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                    title="Edit"
                  >
                    <FiEdit2 className="text-blue-600 w-5 h-5" />
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
                    title="Mark as finished"
                  >
                    <FiCheck className="text-green-500 w-5 h-5" />
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