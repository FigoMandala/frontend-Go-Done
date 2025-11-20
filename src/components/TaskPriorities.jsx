import React from 'react';
// Impor ikon-ikon yang kita perlukan
import { FaPen, FaTrashAlt, FaCheck } from 'react-icons/fa';

// --- Sub-Komponen untuk Kartu Tugas (DIPERBARUI) ---
// Kita perbarui style card ini agar sesuai gambar
const TaskCard = ({ title, subtitle, dueDate, dueColor, borderColor }) => {
  return (
    // Latar card jadi abu-abu (bg-gray-50) dan punya border kiri
    <div className={`bg-gray-50 p-4 rounded-lg border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-center">
        {/* Info di Kiri */}
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
          <p className={`text-xs font-medium ${dueColor || 'text-gray-700'}`}>{dueDate}</p>
        </div>
        {/* Ikon di Kanan (diberi warna) */}
        <div className="flex items-center gap-3">
          <FaPen className="cursor-pointer text-blue-500 hover:text-blue-700 text-xs" />
          <FaTrashAlt className="cursor-pointer text-red-500 hover:text-red-700 text-xs" />
          <FaCheck className="cursor-pointer text-green-500 hover:text-green-700 text-xs" />
        </div>
      </div>
    </div>
  );
};


function TaskPriorities() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. JUDUL UTAMA */}
      <h1 className="text-2xl font-semibold text-gray-800 pl-6 pt-6">Task Priorities</h1>

      {/* 2. KONTEN GRID (3 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* === Kolom 1: High Priority === */}
        {/* Kolom kini bg-white, rounded, shadow, dan border-t-8 */}
        <div className="bg-white rounded-xl shadow-lg border-t-8 border-red-500">
          {/* Header (hanya butuh padding) */}
          <div className="p-4">
            <h3 className="font-semibold text-lg text-red-600">High Priority</h3>
          </div>
          {/* List Task (diberi padding) */}
          <div className="space-y-4 px-4 pb-4">
            <TaskCard 
              title="Kuis 7 Jaringan Komputer" 
              subtitle="Jaringan Komputer" 
              dueDate="Due: Tomorrow"
              dueColor="text-red-600"
              borderColor="border-red-500" // Border kiri card
            />
            <TaskCard 
              title="Tugas Pendahuluan" 
              subtitle="Jaringan Komputer" 
              dueDate="Due: Sunday"
              dueColor="text-red-600"
              borderColor="border-red-500" // Border kiri card
            />
            <TaskCard 
              title="Tugas Kecerdasan Artificial" 
              subtitle="Kecerdasan Artificial" 
              dueDate="Due: Next Week"
              dueColor="text-red-600"
              borderColor="border-red-500" // Border kiri card
            />
            <TaskCard 
              title="Tugas Kelompok" 
              subtitle="Interaksi Manusia Komputer" 
              dueDate="Due: Next Week"
              dueColor="text-red-600"
              borderColor="border-red-500" // Border kiri card
            />
          </div>
        </div>

        {/* === Kolom 2: Medium Priority === */}
        <div className="bg-white rounded-xl shadow-lg border-t-8 border-yellow-500">
          <div className="p-4">
            <h3 className="font-semibold text-lg text-yellow-600">Medium Priority</h3>
          </div>
          <div className="space-y-4 px-4 pb-4">
            <TaskCard 
              title="Kuis 7 Keamanan Siber" 
              subtitle="Keamanan Siber" 
              dueDate="Due: Friday"
              dueColor="text-yellow-600"
              borderColor="border-yellow-500" // Border kiri card
            />
            <TaskCard 
              title="Kuis 7 IMK" 
              subtitle="Interaksi Manusia Komputer" 
              dueDate="Due: Sunday"
              dueColor="text-yellow-600"
              borderColor="border-yellow-500" // Border kiri card
            />
          </div>
        </div>

        {/* === Kolom 3: Low Priority === */}
        <div className="bg-white rounded-xl shadow-lg border-t-8 border-green-500">
          <div className="p-4">
            <h3 className="font-semibold text-lg text-green-600">Low Priority</h3>
          </div>
          <div className="space-y-4 px-4 pb-4">
            <TaskCard 
              title="Tugas 5 IMPAL" 
              subtitle="IMPAL" 
              dueDate="Due: Tomorrow" // Diperbarui dari gambar
              dueColor="text-green-600"
              borderColor="border-green-500" // Border kiri card
            />
            <TaskCard 
              title="Tugas Motion Lab" 
              subtitle="Motion Lab" 
              dueDate="Due: Next Week"
              dueColor="text-green-600"
              borderColor="border-green-500" // Border kiri card
            />
            <TaskCard 
              title="Tugas Individu IMPAL" 
              subtitle="IMPAL" 
              dueDate="Due: Next Week"
              dueColor="text-green-600"
              borderColor="border-green-500" // Border kiri card
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default TaskPriorities;