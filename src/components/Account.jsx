import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaEnvelope, FaBell } from 'react-icons/fa';
import { FiUpload, FiTrash2, FiX, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

function Account() {
  const navigate = useNavigate();
  const [notifOn, setNotifOn] = useState(true);
  
  // --- STATE NAVIGASI HALAMAN ---
  const [isEditing, setIsEditing] = useState(false); 

  // --- STATE POPUP ---
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // --- STATE FORM EDIT PROFILE ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || ''
      }));
    }
  }, []);

  const handleBack = () => navigate('/dashboard');
  const handleDelete = () => toast('Delete account - not implemented', { icon: '🗑️' });

  // --- LOGIKA BARU: UPLOAD PHOTO ---
  const handleUploadPhoto = () => {
    // Tidak menutup modal, hanya notifikasi kecil bahwa file 'terpilih'
    toast.success("New photo selected!", { icon: '📷' });
  };

  // --- LOGIKA BARU: TOMBOL REMOVE (MUNCUL KONFIRMASI) ---
  const handleRemoveClick = () => {
    // Popup Photo Modal TETAP BUKA (di belakang), kita tumpuk dengan Remove Confirm
    setShowRemoveConfirm(true); 
  };

  // --- LOGIKA BARU: KONFIRMASI REMOVE YES ---
  const handleRemoveConfirmYes = () => {
    setShowRemoveConfirm(false); // Tutup konfirmasi hapus
    // Popup Edit Photo MASIH TERBUKA
    toast.success("Photo removed from preview", { icon: '🗑️' });
  };

  // --- LOGIKA BARU: FINAL SAVE (Tombol Save Change) ---
  // Inilah satu-satunya yang memunculkan Popup Sukses dan menutup modal foto
  const handleSavePhoto = () => {
    setShowPhotoModal(false); // Tutup modal edit foto
    setPopupMessage("You have successfully updated your profile picture.");
    setShowSuccessPopup(true); // Munculkan popup sukses
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    setPopupMessage("You have successfully updated your profile information.");
    setShowSuccessPopup(true);
  };

  const togglePass = (field) => {
    setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- TAMPILAN FORM EDIT PROFILE ---
  if (isEditing) {
    return (
      <div className="min-h-screen bg-[#21569A] py-16 relative animate-fade-in-up">
        <button onClick={() => setIsEditing(false)} className="absolute left-8 top-20 bg-white rounded-full w-12 h-12 shadow-md flex items-center justify-center text-[#21569A] z-20 hover:scale-105 transition"><FaArrowLeft /></button>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-white mb-6 pl-2">Edit Profile</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-gray-700 font-semibold mb-2">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 outline-none focus:border-blue-500" /></div>
                <div><label className="block text-gray-700 font-semibold mb-2">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 outline-none focus:border-blue-500" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-gray-700 font-semibold mb-2">Email Address</label><div className="relative"><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 pl-10 bg-gray-50 outline-none focus:border-blue-500" /><FaEnvelope className="absolute left-3 top-3.5 text-gray-400" /></div></div>
                <div><label className="block text-gray-700 font-semibold mb-2">Phone Number</label><input type="tel" name="phone" placeholder="+62 8..." onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 outline-none focus:border-blue-500" /></div>
              </div>
              <hr className="border-gray-200 my-4" />
              <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
              <div><label className="block text-gray-700 font-semibold mb-2">Current Password</label><div className="relative"><input type={showPass.current ? "text" : "password"} name="currentPassword" className="w-full border border-gray-300 rounded-lg p-3 pr-10 bg-gray-50 outline-none focus:border-blue-500" placeholder="Enter current password" /><button type="button" onClick={() => togglePass('current')} className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600">{showPass.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}</button></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-gray-700 font-semibold mb-2">New Password</label><div className="relative"><input type={showPass.new ? "text" : "password"} name="newPassword" className="w-full border border-gray-300 rounded-lg p-3 pr-10 bg-gray-50 outline-none focus:border-blue-500" placeholder="Enter new password" /><button type="button" onClick={() => togglePass('new')} className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600">{showPass.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}</button></div></div>
                <div><label className="block text-gray-700 font-semibold mb-2">Confirm New Password</label><div className="relative"><input type={showPass.confirm ? "text" : "password"} name="confirmPassword" className="w-full border border-gray-300 rounded-lg p-3 pr-10 bg-gray-50 outline-none focus:border-blue-500" placeholder="Re-enter new password" /><button type="button" onClick={() => togglePass('confirm')} className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600">{showPass.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}</button></div></div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={handleSaveProfile} className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-medium py-2.5 px-8 rounded-lg transition-all shadow-md">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-medium py-2.5 px-8 rounded-lg transition-all shadow-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN ACCOUNT VIEW (DEFAULT) ---
  return (
    <div className="min-h-screen bg-[#21569A] py-16 relative">
      
      {/* POPUP SUKSES (CONGRATULATIONS) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-lg w-full mx-4 animate-scale-in">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-green-200 shadow-lg">
              <FiCheck className="text-white w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
            <p className="text-gray-500/70 mb-6 font-medium">{popupMessage}</p>
            <button onClick={() => setShowSuccessPopup(false)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-10 rounded-lg transition-all shadow-md active:scale-95">Ok</button>
          </div>
        </div>
      )}

      {/* POPUP KONFIRMASI REMOVE PHOTO */}
      {/* Z-Index lebih tinggi (60) supaya muncul di atas Photo Modal (50) */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 backdrop-blur-[2px] transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-md w-full mx-4 animate-scale-in border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Remove Photo?</h2>
            <p className="text-gray-500/80 mb-8 font-medium">Are you sure you want to remove your current profile photo?</p>
            <div className="flex gap-4 w-full">
              {/* Tombol Yes (Kiri) */}
              <button 
                onClick={handleRemoveConfirmYes} 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
              >
                Yes, Remove
              </button>
              {/* Tombol No (Kanan) */}
              <button 
                onClick={() => setShowRemoveConfirm(false)} 
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP INPUT FOTO PROFIL */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-scale-in">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Photo Profile</h2>
            <div className="flex justify-center mb-6 relative">
              <div className="relative">
                <img src="https://i.pravatar.cc/120" alt="Preview" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg" />
                <div className="absolute bottom-0 right-0 bg-[#21569A] p-2 rounded-lg text-white shadow-md border-2 border-white"><FaCamera className="w-4 h-4" /></div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <button onClick={handleUploadPhoto} className="w-full border-2 border-dashed border-blue-300 text-blue-500 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                <FiUpload /> Upload New Photo
              </button>
              <button onClick={handleRemoveClick} className="w-full border border-red-200 text-red-500 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                <FiTrash2 /> Remove Photo
              </button>
            </div>
            
            <div className="bg-blue-50/50 rounded-xl p-4 mb-8 text-left border border-blue-100">
              <p className="font-semibold text-gray-700 text-sm mb-2">Photo Guidelines:</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                <li>Recommended size: 400x400 pixels or larger</li>
                <li>Accepted formats: JPG, PNG, GIF</li>
                <li>Maximum file size: 5MB</li>
                <li>Use a clear, professional photo</li>
              </ul>
            </div>
            
            <div className="flex gap-4">
              <button onClick={handleSavePhoto} className="flex-1 bg-[#2b7ae0] text-white font-semibold py-2.5 rounded-lg hover:bg-[#21569A] transition shadow-md flex items-center justify-center gap-2"><FiCheck /> Save Change</button>
              <button onClick={() => setShowPhotoModal(false)} className="flex-1 border border-red-300 text-red-500 font-semibold py-2.5 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2"><FiX /> Cancel</button>
            </div>
          </div>
        </div>
      )}

      <button onClick={handleBack} className="absolute left-8 top-20 bg-white rounded-full w-12 h-12 shadow-md flex items-center justify-center text-[#21569A] z-20 hover:scale-105 transition"><FaArrowLeft /></button>

      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Account information</h2>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-6 mb-6">
            <div onClick={() => setShowPhotoModal(true)} className="relative cursor-pointer group" title="Change Profile Photo">
              <img src="https://i.pravatar.cc/120" alt="Profile" className="w-24 h-24 rounded-full object-cover shadow group-hover:opacity-90 transition" />
              <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-[#21569A] shadow group-hover:scale-110 transition"><FaCamera /></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{formData.firstName} {formData.lastName}</h3>
              <p className="text-sm text-gray-500">Student</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4"><div className="text-[#21569A]"><FaEnvelope /></div><div className="text-gray-700">{formData.email}</div></div>
              <div className="text-sm text-gray-500 cursor-pointer hover:text-[#21569A]" onClick={() => setIsEditing(true)}>Change Email Address</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4"><div className="text-[#21569A]"><FaBell /></div><div className="text-gray-700">Notification</div></div>
              <button onClick={() => setNotifOn(!notifOn)} aria-pressed={notifOn} className={`w-14 h-8 rounded-full p-1 flex items-center ${notifOn ? 'bg-[#21569A]' : 'bg-[#21569A]/70'} shadow-inner transition-colors duration-300`}><div className={`w-6 h-6 rounded-full transition-transform duration-300 ${notifOn ? 'translate-x-6 bg-white' : 'translate-x-0 bg-gray-300'}`} /></button>
            </div>
            <div className="flex gap-4 justify-center pt-4">
              <button onClick={handleDelete} className="px-6 py-2 border border-red-300 rounded-md text-red-500 hover:bg-red-50 transition">Delete Account</button>
              <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-[#21569A] text-white rounded-md hover:bg-[#1B4B59] transition">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;