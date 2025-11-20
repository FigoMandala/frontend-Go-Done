import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 28)); // November 28, 2024

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const days = [];
  
  for (let i = 0; i < firstDayOfMonth(currentDate); i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= daysInMonth(currentDate); i++) {
    days.push(i);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const eventsMap = {
    1: ['Kecerdasan Artifisial - 09:30'],
    3: ['Interaksi Manusia Komputer - 13:30'],
    7: ['Kuis 7 Jaringan Komputer'],
    15: ['Kuis 7 Keamanan Siber'],
    28: ['Tugas 5 IMPAL Due'],
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* JUDUL */}
      <h1 className="text-2xl font-semibold text-gray-800 pl-6 pt-6">Calendar</h1>

      {/* KONTEN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CALENDAR UTAMA */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{monthName}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaChevronLeft />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-center ${
                  day === null 
                    ? '' 
                    : day === 28
                    ? 'bg-blue-100 border-2 border-blue-500 font-semibold'
                    : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

        </div>

        {/* UPCOMING EVENTS */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-semibold text-gray-800">Kecerdasan Artifisial</p>
              <p className="text-xs text-gray-600">Nov 1 at 09:30</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-semibold text-gray-800">Interaksi Manusia Komputer</p>
              <p className="text-xs text-gray-600">Nov 3 at 13:30</p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="text-sm font-semibold text-gray-800">Kuis 7 Jaringan Komputer</p>
              <p className="text-xs text-gray-600">Nov 7</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm font-semibold text-gray-800">Kuis 7 Keamanan Siber</p>
              <p className="text-xs text-gray-600">Nov 15</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-semibold text-gray-800">Tugas 5 IMPAL Due</p>
              <p className="text-xs text-gray-600">Nov 28</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Calendar;
