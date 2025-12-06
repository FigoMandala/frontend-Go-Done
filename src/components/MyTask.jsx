import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiPlus, FiChevronDown } from 'react-icons/fi';

// --- KOMPONEN DROPDOWN CUSTOM (DENGAN ANIMASI) ---
const CustomDropdown = ({ label, options, selected, onSelect }) => {
const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      
      {/* Tombol Trigger Dropdown */}
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

      {/* Backdrop Transparan (Untuk menutup saat klik di luar) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* List Item dengan Animasi */}
      <div className={`absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-300 origin-top ease-out
        ${isOpen ? 'max-h-60 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95'}`}>
        
        <ul className="py-1">
          {options.map((option, index) => (
            <li 
              key={index}
              onClick={() => {
                onSelect(option.value); // Simpan value
                setIsOpen(false);       // Tutup dropdown
              }}
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

// --- KOMPONEN UTAMA MYTASK ---
function MyTask() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // State untuk form input (agar dropdown bisa berubah teksnya)
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const handleCreateTask = () => {
      setShowAddForm(false);     // 1. Tutup Form
      setPopupMessage("You have successfully added a new task!"); // <--- Set Pesan
      setShowSuccessPopup(true); // 2. Munculkan Popup
    };

  const handleUpdateTask = () => {
      // Logika update ke backend nanti disini
      setShowAddForm(false);     // Tutup form
      setPopupMessage("You have successfully updated the task!"); // <--- Set Pesan
      setShowSuccessPopup(true); // Munculkan popup sukses
  };

  const handleDeleteConfirm = () => {
      setShowDeletePopup(false); // Tutup konfirmasi delete
      setPopupMessage("You have successfully deleted the task!"); // <--- Set Pesan
      setShowSuccessPopup(true); // Munculkan popup sukses
  };

  // --- TAMPILAN FORM ADD TASK ---
  if (showAddForm) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in-up"> {/* Tambahan animasi masuk */}
        <h1 className="text-2xl font-semibold text-gray-800 pl-6 pt-6">{isEditMode ? 'Edit Task' : 'Add Task'}</h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mx-6 mb-6">
          <form className="space-y-6">
            
            {/* Task Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Task Title</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 transition-all duration-300"
                placeholder="Enter task title"
              />
            </div>

            {/* Custom Dropdown: Category */}
            <CustomDropdown 
              label="Select Category"
              selected={category} // Menggunakan state
              onSelect={setCategory} // Fungsi set state
              options={[
                { label: "IMPAL", value: "IMPAL" },
                { label: "Jaringan Komputer", value: "Jaringan Komputer" },
                { label: "Keamanan Siber", value: "Keamanan Siber" },
                { label: "Kecerdasan Artificial", value: "Kecerdasan Artificial" },
              ]}
            />

            {/* Task Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Task Description</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 transition-all duration-300"
                placeholder="Enter description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Custom Dropdown: Priority */}
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

              {/* Deadline */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Choose Deadline</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 transition-all duration-300"
                />
              </div>
            </div>

            {/* BUTTONS ACTION */}
            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                // Jika Edit Mode -> panggil handleUpdateTask, Jika tidak -> handleCreateTask
                onClick={isEditMode ? handleUpdateTask : handleCreateTask}
                className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isEditMode ? 'Update Task' : 'Create Task'}
              </button>
              <button 
                type="button"
                onClick={handleCreateTask}
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

  // --- TAMPILAN LIST TASK (DEFAULT) ---
  return (
    <div className="relative flex flex-col gap-6">
      
      {/* --- TAMBAHAN BARU: KODINGAN POPUP --- */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-lg w-full mx-4 animate-scale-in">
            {/* Icon Centang */}
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-green-200 shadow-lg">
              <FiCheck className="text-white w-8 h-8 stroke-[3]" />
            </div>
            
            {/* Teks */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
            {/* Teks mengambil dari state popupMessage */}
            <p className="text-gray-500/70 mb-6 font-medium">
              {popupMessage}
            </p>
            
            {/* Tombol Sure */}
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-10 rounded-lg transition-all shadow-md active:scale-95"
            >
              Ok
            </button>
          </div>
        </div>
      )}
      {/* --- POPUP DELETE --- */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-lg w-fit mx-4 animate-scale-in">
            
            {/* Judul & Teks */}
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Delete</h2>
            <p className="text-gray-500/70 mb-8 font-medium text-sm">
              Are you sure want to delete this task permanently?
            </p>
            
            {/* Tombol Action (Posisi Ditukar) */}
            <div className="flex gap-4 w-full">
              
              {/* Tombol Delete (Merah) - Ditaruh di KIRI */}
              <button 
                onClick={handleDeleteConfirm} // Nanti diganti logika hapus backend
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                Yes, Delete
              </button>

              {/* Tombol Cancel (Biru) - Ditaruh di KANAN */}
              <button 
                onClick={() => setShowDeletePopup(false)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center pl-6 pt-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Task</h1>
        <button 
          onClick={() => { 
            setShowAddForm(true);
            setIsEditMode(false);
          } }
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
        >
          <FiPlus className="w-5 h-5" />
          <span className="font-medium">Add Task</span>
        </button>
      </div>

      {/* KONTEN */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          {/*Task Item 1 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-red-500 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 flex-1">
              <div>
                <p className="text-sm font-semibold text-gray-800">Kuis 7 Jaringan Komputer</p>
                <p className="text-xs text-gray-500">Jaringan Komputer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-600">Due: Tomorrow</span>
              <button 
                onClick={() => {
                  setShowAddForm(true); // Buka form
                  setIsEditMode(true);  // Aktifkan mode EDIT
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition"><FiEdit2 className="w-5 h-5 text-blue-600" /></button>
              <button 
                onClick={() => setShowDeletePopup(true)}
                className="p-2 hover:bg-gray-200 rounded-lg transition"><FiTrash2 className="w-5 h-5 text-red-600" /></button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition"><FiCheck className="w-5 h-5 text-green-600" /></button>
            </div>
          </div>

          {/* Task Item 2 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-center gap-3 flex-1">
              <div>
                <p className="text-sm font-semibold text-gray-800">Kuis 7 Keamanan Siber</p>
                <p className="text-xs text-gray-500">Keamanan Siber</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-600">Due: Friday</span>
              <button 
                onClick={() => {
                  setShowAddForm(true); // Buka form
                  setIsEditMode(true);  // Aktifkan mode EDIT
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Edit task">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button 
                onClick={() => setShowDeletePopup(true)}
                className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Delete task">
                <FiTrash2 className="w-5 h-5 text-red-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Mark finished">
                <FiCheck className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>

          {/* Task Item 3 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center gap-3 flex-1">
              <div>
                <p className="text-sm font-semibold text-gray-800">Tugas 5 IMPAL</p>
                <p className="text-xs text-gray-500">IMPAL</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-600">Due: Sunday</span>
              <button 
                onClick={() => {
                  setShowAddForm(true); // Buka form
                  setIsEditMode(true);  // Aktifkan mode EDIT
                }} 
                className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Edit task">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button 
                onClick={() => setShowDeletePopup(true)}
                className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Delete task">
                <FiTrash2 className="w-5 h-5 text-red-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Mark finished">
                <FiCheck className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>

          {/* Task Item 4 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center gap-3 flex-1">
              <div>
                <p className="text-sm font-semibold text-gray-800">Tugas Pendahuluan Jaringan Komputer</p>
                <p className="text-xs text-gray-500">Jaringan Komputer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-600">Due: Sunday</span>
              <button 
                onClick={() => {
                  setShowAddForm(true); // Buka form
                  setIsEditMode(true);  // Aktifkan mode EDIT
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Edit task">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button 
                onClick={() => setShowDeletePopup(true)}
                className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Delete task">
                <FiTrash2 className="w-5 h-5 text-red-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Mark finished">
                <FiCheck className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>

          {/* Task Item 5 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center gap-3 flex-1">
              <div>
                <p className="text-sm font-semibold text-gray-800">Tugas Kecerdasan Artificial</p>
                <p className="text-xs text-gray-500">Kecerdasan Artificial</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-600">Due: Next Week</span>
              <button 
                onClick={() => {
                  setShowAddForm(true); // Buka form
                  setIsEditMode(true);  // Aktifkan mode EDIT
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Edit task">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button 
                onClick={() => setShowDeletePopup(true)}
                className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Delete task">
                <FiTrash2 className="w-5 h-5 text-red-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Mark finished">
                <FiCheck className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>

    </div>);
}

export default MyTask;