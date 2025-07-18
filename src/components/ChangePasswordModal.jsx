import { useState } from "react";
import { toast } from "react-toastify";
import { KeyRound } from "lucide-react";

const ChangePasswordModal = ({ open, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE.replace('/api', '')}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.detail === "Password changed successfully") {
        toast.success("Password changed successfully.");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(data.detail || "Failed to change password.");
      }
    } catch {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl">×</button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><KeyRound className="w-5 h-5" /> Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Old Password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium mt-2 disabled:opacity-50">
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal; 