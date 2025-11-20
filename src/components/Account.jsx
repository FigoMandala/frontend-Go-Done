import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaEnvelope, FaBell } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Account() {
  const navigate = useNavigate();
  const [notifOn, setNotifOn] = useState(true);

  const handleBack = () => navigate('/dashboard');
  const handleEdit = () => toast('Edit profile - not implemented', { icon: '✏️' });
  const handleDelete = () => toast('Delete account - not implemented', { icon: '🗑️' });

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { first_name: 'Figo', last_name: 'Mandala', email: 'FigoMandala@gmail.com' };

  return (
    <div className="min-h-screen bg-[#21569A] py-16 relative">
      {/* Floating back button */}
      <button
        onClick={handleBack}
        className="absolute left-8 top-20 bg-white rounded-full w-12 h-12 shadow-md flex items-center justify-center text-[#21569A] z-20"
        aria-label="Back to dashboard"
      >
        <FaArrowLeft />
      </button>

      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Account information</h2>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/120"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover shadow"
              />
              <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-[#21569A] shadow">
                <FaCamera />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">{user.first_name} {user.last_name}</h3>
              <p className="text-sm text-gray-500">Student</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-[#21569A]"><FaEnvelope /></div>
                <div className="text-gray-700">{user.email}</div>
              </div>
              <div className="text-sm text-gray-500">Change Email Address</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-[#21569A]"><FaBell /></div>
                <div className="text-gray-700">Notification</div>
              </div>

              {/* Custom white switch */}
              <button
                onClick={() => setNotifOn(!notifOn)}
                aria-pressed={notifOn}
                className={`w-14 h-8 rounded-full p-1 flex items-center ${notifOn ? 'bg-[#21569A]' : 'bg-[#21569A]/70'} shadow-inner`}
              >
                <div className={`w-6 h-6 rounded-full transition-transform ${notifOn ? 'translate-x-6 bg-white' : 'translate-x-0 bg-gray-300'}`} />
              </button>
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={handleDelete} className="px-6 py-2 border border-red-300 rounded-md text-red-500 hover:bg-red-50">Delete Account</button>
              <button onClick={handleEdit} className="px-6 py-2 bg-[#21569A] text-white rounded-md hover:bg-[#1B4B59]">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
