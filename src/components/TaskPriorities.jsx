import React, { useEffect, useState } from "react";
import backend from "../api/backend";
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

// --- Task Card ---
const TaskCard = ({ task, onEdit, onDelete, onDone }) => {
  const priority = normalizePriority(task.priority);

  const borderColor =
    priority === "High"
      ? "border-red-500"
      : priority === "Medium"
      ? "border-yellow-500"
      : "border-green-500";

  const textColor =
    priority === "High"
      ? "text-red-600"
      : priority === "Medium"
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <div className={`bg-gray-50 p-4 rounded-lg border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-gray-800">{task.title}</p>
          <p className="text-xs text-gray-500">{task.category_name}</p>
          <p className={`text-xs font-medium ${textColor}`}>
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

function TaskPriorities() {
  const [highTasks, setHighTasks] = useState([]);
  const [mediumTasks, setMediumTasks] = useState([]);
  const [lowTasks, setLowTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await backend.get("/tasks");

      const tasks = res.data
        .filter((t) => t.status !== "completed") // Filter out completed tasks
        .map((t) => ({
          ...t,
          priority: normalizePriority(t.priority),
        }));

      setHighTasks(tasks.filter((t) => t.priority === "High"));
      setMediumTasks(tasks.filter((t) => t.priority === "Medium"));
      setLowTasks(tasks.filter((t) => t.priority === "Low"));
    } catch (err) {
      console.error("Error loading tasks", err);
    }
  };

  const handleDelete = async (taskId) => {
    await backend.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  const handleDone = async (taskId) => {
    await backend.put(`/tasks/${taskId}`, { status: "Done" });
    fetchTasks();
  };

  const handleEdit = (task) => {
    window.location.href = `/dashboard/mytask?edit=${task.task_id}`;
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-800 pl-6 pt-6">
        Task Priorities
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* HIGH */}
        <div className="bg-white rounded-xl shadow-lg border-t-8 border-red-500">
          <div className="p-4">
            <h3 className="font-semibold text-lg text-red-600">High Priority</h3>
          </div>
          <div className="space-y-4 px-4 pb-4">
            {highTasks.length === 0 && (
              <p className="text-sm text-gray-500">No high priority tasks.</p>
            )}
            {highTasks.map((task) => (
              <TaskCard
                key={task.task_id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDone={handleDone}
              />
            ))}
          </div>
        </div>

        {/* MEDIUM */}
        <div className="bg-white rounded-xl shadow-lg border-t-8 border-yellow-500">
          <div className="p-4">
            <h3 className="font-semibold text-lg text-yellow-600">
              Medium Priority
            </h3>
          </div>
          <div className="space-y-4 px-4 pb-4">
            {mediumTasks.length === 0 && (
              <p className="text-sm text-gray-500">No medium priority tasks.</p>
            )}
            {mediumTasks.map((task) => (
              <TaskCard
                key={task.task_id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDone={handleDone}
              />
            ))}
          </div>
        </div>

        {/* LOW */}
        <div className="bg-white rounded-xl shadow-lg border-t-8 border-green-500">
          <div className="p-4">
            <h3 className="font-semibold text-lg text-green-600">
              Low Priority
            </h3>
          </div>
          <div className="space-y-4 px-4 pb-4">
            {lowTasks.length === 0 && (
              <p className="text-sm text-gray-500">No low priority tasks.</p>
            )}
            {lowTasks.map((task) => (
              <TaskCard
                key={task.task_id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDone={handleDone}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TaskPriorities;
