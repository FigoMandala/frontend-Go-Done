
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaEnvelope, FaBell } from 'react-icons/fa';
import { FiUpload, FiTrash2, FiX, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import backend from '../api/backend';
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

function Account() {
  const navigate = useNavigate();
  
  // ========= Core states =========
  const [user, setUser] = useState({});
  const [notifOn, setNotifOn] = useState(() => {
    const saved = localStorage.getItem("notifEnabled");
    return saved === null ? true : JSON.parse(saved);
  });
  const [isEditing, setIsEditing] = useState(false);

  // ========= Popup (success & error) =========
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupError, setIsPopupError] = useState(false);

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showDeletePhoto, setShowDeletePhoto] = useState(false);

  // ========= Photo modals =========
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);

  // ========= Photo states =========
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ========= Crop states =========
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // ========= Form data =========
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // ========= Password visibility =========
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // ===============================
  // FETCH USER (on mount)
  // ===============================
  useEffect(() => {
    const fetchUserData = async () => {
      try {
const res = await backend.get("/user/me");

        setUser(res.data);
        setFormData({
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          email: res.data.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } catch (err) {
        console.log("Error GET /me:", err);
      }
    };
    fetchUserData();
  }, []);

  // ===============================
  // Toast Helper - Check Notification Status
  // ===============================
  const showToast = (type, message) => {
    if (!notifOn) return;
    toast[type](message);
  };

  // ===============================
  // Handlers
  // ===============================
  const handleBack = () => navigate('/dashboard');

  const handleDelete = () => {setShowDeleteAccount(true);};

  const handleRemovePhoto = () => setShowDeletePhoto(true);

  const confirmDeletePhoto = async () => {
    try {
      const res = await backend.delete("/user/photo");

      if (res.data.success) {
        setUser(prev => ({ ...prev, photo_url: null }));
        showToast("success", "Photo removed!");
      } else {
        showToast("error", "Gagal hapus foto!");
      }
    } catch (err) {
      console.log(err);
      showToast("error", "Gagal hapus foto!");
    }

    setShowDeletePhoto(false);
  };


  const confirmDeleteAccount = async () => {
    try {
      const res = await backend.delete("/user/delete");

      if (res.data.success) {
        localStorage.removeItem("token");

        setIsPopupError(false);
        setPopupMessage("Your account has been deleted.");
        setShowSuccessPopup(true);

        setTimeout(() => {
          navigate("/");
        }, 2000);

      } else {
        setIsPopupError(true);
        setPopupMessage(res.data.message);
        setShowSuccessPopup(true);
      }

    } catch (err) {
      console.log("DELETE ERROR:", err);
      setIsPopupError(true);
      setPopupMessage("Failed to delete account!");
      setShowSuccessPopup(true);
    }
  };


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePass = (field) =>
    setShowPass(prev => ({ ...prev, [field]: !prev[field] }));

  // ===============================
  // SAVE PROFILE (with validation)
  // ===============================
  const handleSaveProfile = async () => {
    if (notifOn) toast.dismiss();

    // ---- Basic validation
    if (!formData.firstName.trim()) return showToast("error", "First name tidak boleh kosong!");
    if (!formData.lastName.trim()) return showToast("error", "Last name tidak boleh kosong!");
    if (!formData.email.trim()) return showToast("error", "Email tidak boleh kosong!");
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      return showToast("error", "Format email tidak valid!");
    }

    const isChangingPassword =
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword;

    if (isChangingPassword) {

      if (!formData.currentPassword.trim()) {
        setIsPopupError(true);
        setPopupMessage("Current password harus diisi!");
        setShowSuccessPopup(true);
        return;
      }

      if (formData.newPassword.length < 6) {
        setIsPopupError(true);
        setPopupMessage("Password minimal 6 karakter!");
        setShowSuccessPopup(true);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setIsPopupError(true);
        setPopupMessage("Konfirmasi password tidak cocok!");
        setShowSuccessPopup(true);
        return;
      }
    }


    // ---- Build payload
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email
    };
    if (isChangingPassword) {
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    }

    try {
      const res = await backend.put("/user/update", payload);

      // ---- Handle known backend failures (e.g., duplicate email)
      if (!res.data.success) {
        setIsPopupError(true);
        setPopupMessage(res.data.message || "Failed to update profile!");
        setShowSuccessPopup(true);
        return;
      }
      // ---- Success handling
      const changedName =
        formData.firstName !== user.first_name ||
        formData.lastName !== user.last_name;
      const changedEmail = formData.email !== user.email;

      let msg = "Profile updated successfully!";
      if (isChangingPassword) msg = "Password updated successfully!";
      else if (changedName && !changedEmail) msg = "Name updated successfully!";
      else if (!changedName && changedEmail) msg = "Email updated successfully!";

      // Update UI immediately
      setUser(prev => ({
        ...prev,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        photo_url: prev.photo_url
      }));

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      setIsPopupError(false);
      setPopupMessage(msg);
      setShowSuccessPopup(true);
      setIsEditing(false);

    } catch (err) {
      console.log("Update error:", err);
      setIsPopupError(true);
      setPopupMessage("Failed to update profile!");
      setShowSuccessPopup(true);
    }
  };

  // ===============================
  // PHOTO: select, crop, upload
  // ===============================
  const handleSelectPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowCropModal(true); // langsung buka modal crop
  };

  const handleCropComplete = async () => {
    try {
      const croppedFile = await getCroppedImg(previewUrl, croppedAreaPixels);
      await uploadCroppedPhoto(croppedFile);
      setShowCropModal(false);
      setPreviewUrl(null);
      URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
    } catch (err) {
      console.log("Crop error:", err);
      showToast("error", "Gagal crop foto!");
    }
  };

  const uploadCroppedPhoto = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await backend.post("/user/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data && res.data.success) {
        showToast("success", "Foto profil berhasil diperbarui!");
        // update UI
        setUser(prev => ({
          ...prev,
          photo_url: res.data.photo_url
        }));
      } else {
        showToast("error", res.data?.message || "Gagal upload foto!");
      }

    } catch (err) {
      console.log(err);
      showToast("error", "Gagal upload foto!");
    }
  };

  // ===============================
  // Popups & Modals (with animation)
  // ===============================
  const renderSuccessPopup = () =>
    showSuccessPopup && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 popup-backdrop">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center popup-card max-w-lg">

          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md ${
              isPopupError ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {isPopupError ? (
              <FiX className="text-white w-8 h-8 animate-pulse" />
            ) : (
              <FiCheck className="text-white w-8 h-8 animate-pulse" />
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {isPopupError ? "Error" : "Success"}
          </h2>

          <p className="text-gray-600 mb-6 text-center">{popupMessage}</p>

          <button
            onClick={() => setShowSuccessPopup(false)}
            className={`${
              isPopupError
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold py-2.5 px-10 rounded-lg transition-all`}
          >
            OK
          </button>
        </div>
      </div>
    );

  const renderPhotoModal = () =>
    showPhotoModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <h2 className="text-xl font-bold text-center mb-6">Photo Profile</h2>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={user.photo_url
                  ? user.photo_url
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8IjqgqQD8US-0D098l2zOj7ot2utQNCJlUw&s"
                }
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
              />
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => {
                document.getElementById("uploadPhotoInput")?.click();
                setShowPhotoModal(false); // modal ini tutup; crop modal akan buka setelah file dipilih
              }}
              className="w-full border-2 border-dashed border-blue-300 text-blue-500 font-medium py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <FiUpload /> Upload New Photo
            </button>
            <button
              onClick={() => {
                setShowPhotoModal(false);
                setShowDeletePhoto(true);
              }}
              className="w-full border border-red-200 text-red-500 font-medium py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <FiTrash2 /> Remove Photo
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              <FiX /> Cancel
            </button>
          </div>
        </div>
      </div>
    );

  const renderCropModal = () =>
    showCropModal && previewUrl && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
          <h2 className="text-xl font-semibold text-center mb-4">Crop Photo</h2>

          <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <Cropper
              image={previewUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(area, pixels) => setCroppedAreaPixels(pixels)}
            />
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full mt-4"
          />

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleCropComplete}
              className="flex-1 bg-[#21569A] text-white py-2 rounded-lg"
            >
              Save
            </button>

            <button
              onClick={() => { setShowCropModal(false); setPreviewUrl(null); }}
              className="flex-1 border border-red-300 text-red-500 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

  const renderDeleteAccountModal = () =>
    showDeleteAccount && (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-3">Delete Account?</h2>
          <p className="text-gray-600 mb-6">This action cannot be undone.</p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowDeleteAccount(false)}
              className="px-6 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteAccount}
              className="px-6 py-2 bg-red-500 text-white rounded-md"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    );


  const renderDeletePhotoModal = () =>
    showDeletePhoto && (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-3">Remove Photo?</h2>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowDeletePhoto(false)}
              className="px-6 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeletePhoto}
              className="px-6 py-2 bg-red-500 text-white rounded-md"
            >
              Yes, Remove
            </button>
          </div>
        </div>
      </div>
    );


  // Reusable password input
  const renderPasswordField = (label, name, showKey) => (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <div className="relative">
        <input
          type={showPass[showKey] ? "text" : "password"}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 pr-10 bg-gray-50"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={() => togglePass(showKey)}
          className="absolute right-3 top-3.5 text-gray-400"
        >
          {showPass[showKey] ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>
    </div>
  );

  // ===============================
  // EDIT PROFILE VIEW
  // ===============================
  if (isEditing) {
    return (
      <div className="min-h-screen bg-[#21569A] py-16 relative">
        {renderSuccessPopup()}
        {renderDeleteAccountModal()}
        {renderDeletePhotoModal()}
        {renderPhotoModal()}
        {renderCropModal()}

        {/* Hidden file input for Upload New Photo button */}
        <input
          type="file"
          id="uploadPhotoInput"
          className="hidden"
          accept="image/*"
          onChange={handleSelectPhoto}
        />

        <button
          onClick={() => setIsEditing(false)}
          className="absolute left-8 top-20 bg-white rounded-full w-12 h-12 shadow-md flex items-center justify-center text-[#21569A]"
        >
          <FaArrowLeft />
        </button>

        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-white mb-6 pl-2">Edit Profile</h2>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 bg-gray-50"
                  />
                  <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <hr className="border-gray-200 my-4" />

              {/* Password Section */}
              <h3 className="text-lg font-bold text-gray-800">Change Password (optional)</h3>
              {renderPasswordField("Current Password", "currentPassword", "current")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderPasswordField("New Password", "newPassword", "new")}
                {renderPasswordField("Confirm New Password", "confirmPassword", "confirm")}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-8 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-8 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // DEFAULT ACCOUNT VIEW
  // ===============================
  return (
    <div className="min-h-screen bg-[#21569A] py-16 relative">
      {renderSuccessPopup()}
      {renderPhotoModal()}
      {renderDeleteAccountModal()}
      {renderDeletePhotoModal()}
      {renderCropModal()}

      {/* Hidden Input for Upload */}
      <input
        type="file"
        id="uploadPhotoInput"
        className="hidden"
        accept="image/*"
        onChange={handleSelectPhoto}
      />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute left-8 top-20 bg-white rounded-full w-12 h-12 shadow-md flex items-center justify-center text-[#21569A]"
      >
        <FaArrowLeft />
      </button>

      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Account information</h2>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Profile header */}
          <div className="flex items-center gap-6 mb-6">
            <div
              onClick={() => setShowPhotoModal(true)}
              className="relative cursor-pointer group"
            >
              <img
                src={user.photo_url
                  ? user.photo_url
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8IjqgqQD8US-0D098l2zOj7ot2utQNCJlUw&s"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover shadow"
              />
              <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-[#21569A] shadow">
                <FaCamera />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-500">Student</p>
            </div>
          </div>

          {/* Account details */}
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FaEnvelope className="text-[#21569A]" />
                <div className="text-gray-700">{user.email}</div>
              </div>
              <div
                className="text-sm text-gray-500 cursor-pointer hover:text-[#21569A]"
                onClick={() => setIsEditing(true)}
              >
                Change Email Address
              </div>
            </div>

            {/* Notification Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FaBell className="text-[#21569A]" />
                <div className="text-gray-700">Notification</div>
              </div>
              <button
                onClick={() => {
                  const newVal = !notifOn;
                  setNotifOn(newVal);
                  localStorage.setItem("notifEnabled", JSON.stringify(newVal));
                }}
                className={`w-14 h-8 rounded-full p-1 flex items-center ${
                  notifOn ? 'bg-[#21569A]' : 'bg-[#21569A]/70'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full transition-transform ${
                    notifOn ? 'translate-x-6 bg-white' : 'translate-x-0 bg-gray-300'
                  }`}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center pt-4">
              <button 
                onClick={handleDelete}
                className="px-6 py-2 border border-red-300 rounded-md text-red-500 hover:bg-red-50"
              >
                Delete Account
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-[#21569A] text-white rounded-md hover:bg-[#1B4B59]"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;