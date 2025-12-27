import React, { useState, useEffect } from "react";
import CustomDropdown from "./CustomDropdown";

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

function EditTaskForm({
  isOpen,
  isEditMode,
  task,
  categories,
  onSave,
  onCancel,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  const [taskTitle, setTaskTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const priorityOptions = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ];

  // Load task data when editing
  useEffect(() => {
    if (isEditMode && task) {
      setTaskTitle(task.title || "");
      setCategoryId(task.categoryId || "");
      setDescription(task.description || "");
      setPriority(task.priority || "");
      setDeadline(normalizeDate(task.deadline) || "");
    } else {
      resetForm();
    }
  }, [isEditMode, task]);

  const resetForm = () => {
    setTaskTitle("");
    setCategoryId("");
    setDescription("");
    setPriority("");
    setDeadline("");
  };

  const normalizeDate = (str) => {
    if (!str) return "";
    if (str.includes("T")) return str.split("T")[0];
    return str;
  };

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
    
    // Validate deadline is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    if (deadlineDate < today) {
      setValidationMessage("Deadline cannot be in the past!");
      setShowValidationPopup(true);
      return false;
    }
    
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const formData = {
      category_id: categoryId,
      title: sanitizeInput(taskTitle.trim()),
      description: sanitizeInput(description.trim()),
      deadline: normalizeDate(deadline),
      priority,
      ...(isEditMode ? {} : { status: "pending" }) // Always set pending for new tasks
    };

    onSave(formData);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  if (!isOpen) return null;

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
            onAddCustom={onAddCategory}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
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
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleSave}
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
    </div>
  );
}

export default EditTaskForm;
