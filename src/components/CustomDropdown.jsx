// src/components/CustomDropdown.jsx
import React, { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiTrash2, FiEdit2 } from "react-icons/fi";

const CustomDropdown = ({
  label,
  options,
  selected,
  onSelect,
  allowCustom = false,
  onAddCustom,
  onEditCategory,
  onDeleteCategory,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleAddCustom = () => {
    const value = customInput.trim();
    if (!value) return;
    onAddCustom?.(value);
    setCustomInput("");
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && <label className="block text-gray-700 font-semibold mb-2">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen((s) => !s)}
        className={`w-full flex justify-between items-center border rounded-lg p-3 bg-gray-50 transition-all duration-200 
          ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300 hover:border-gray-400"}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {options?.find((o) => String(o.value) === String(selected))?.label ||
            placeholder ||
            `Choose ${label || "an option"}...`}
        </span>
        <FiChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-200 origin-top
        ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"}`}
        role="listbox"
      >
        <ul className="py-1 overflow-y-auto max-h-60">
          {options?.length ? (
            options.map((option) => (
              <li
                key={option.value}
                className="px-4 py-3 text-gray-700 flex items-center justify-between hover:bg-blue-50 cursor-pointer group"
              >
                <div
                  className="flex-1 group-hover:text-blue-600 font-medium"
                  onClick={() => {
                    onSelect?.(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEditCategory && (
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-gray-200 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCategory(option.value);
                      }}
                      title="Edit category"
                    >
                      <FiEdit2 className="text-blue-600 w-4 h-4" />
                    </button>
                  )}
                  {onDeleteCategory && (
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-gray-200 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCategory(option.value);
                      }}
                      title="Delete category"
                    >
                      <FiTrash2 className="text-red-600 w-4 h-4" />
                    </button>
                  )}
                  {String(selected) === String(option.value) && <FiCheck className="text-blue-600" />}
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-gray-500">No options</li>
          )}

          {allowCustom && (
            <li className="px-4 py-3 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustom();
                    }
                  }}
                  placeholder="Add new category..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                >
                  Add
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CustomDropdown;
