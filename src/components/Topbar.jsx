import { FaBell, FaSearch } from "react-icons/fa";
import logoGoDone from '../assets/GoDone Logo.png';

function Topbar() {
  return (
    // Kita buat full-width dan tambahkan padding
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      
      {/* 1. LOGO (Baru) */}
      <img 
        src={logoGoDone} 
        alt="GoDone Logo" 
        className="h-7 w-auto" // <-- Atur tinggi logo (h-8 = 32px), lebar otomatis
      />

      {/* 2. SEARCH (Hampir sama) */}
      <div className="flex items-center gap-4">
        <input
          className="px-4 py-2 bg-gray-100 rounded-lg w-[550px] shadow-lg"
          placeholder="Search..."
        />
        <button className="p-3 bg-[#21569A] text-white rounded-lg shadow-2xl">
          <FaSearch />
        </button>
      </div>

      {/* 3. NOTIFIKASI & TANGGAL (Hampir sama) */}
      <div className="flex items-center gap-6">
        {/* Di gambar, notifikasi warnanya biru */}
        <div className="p-3 bg-[#21569A] text-white rounded-lg cursor-pointer shadow-lg">
          <FaBell />
        </div>

        <div className="flex flex-col text-sm text-right">
          <span className="font-semibold">Tuesday</span>
          <span className="opacity-70">28/10/2025</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;