import React from 'react';
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

function MyTask() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* JUDUL */}
      <h1 className="text-2xl font-semibold text-gray-800 pl-6 pt-6">My Task</h1>

      {/* KONTEN */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          
          {/* Task Item 1 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center gap-3 flex-1">
              <div>
                <p className="font-semibold text-gray-800">Kuis 7 Jaringan Komputer</p>
                <p className="text-sm text-gray-500">Jaringan Komputer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-600">Due: Tomorrow</span>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Edit task">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Delete task">
                <FiTrash2 className="w-5 h-5 text-red-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Mark finished">
                <FiCheck className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>

          {/* Task Item 2 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-center gap-3 flex-1">
              <div>
                <p className="font-semibold text-gray-800">Kuis 7 Keamanan Siber</p>
                <p className="text-sm text-gray-500">Keamanan Siber</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-600">Due: Friday</span>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Edit task">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Delete task">
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
                <p className="font-semibold text-gray-800">Tugas 5 IMPAL</p>
                <p className="text-sm text-gray-500">IMPAL</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-600">Due: Sunday</span>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Edit task">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Delete task">
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
                <p className="font-semibold text-gray-800">Tugas Pendahuluan Jaringan Komputer</p>
                <p className="text-sm text-gray-500">Jaringan Komputer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-600">Due: Sunday</span>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Edit task">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Delete task">
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
                <p className="font-semibold text-gray-800">Tugas Kecerdasan Artificial</p>
                <p className="text-sm text-gray-500">Kecerdasan Artificial</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-600">Due: Next Week</span>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Edit task">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition" aria-label="Delete task">
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
  );
}

export default MyTask;
