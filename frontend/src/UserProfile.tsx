import React, { useEffect, useState } from "react";
import { changePassword, getCurrentUser } from "./api";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg({ text: "Not logged in", isError: true });
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const data = await getCurrentUser(token);
        setUser(data);
      } catch (e) {
        setMsg({ text: "Failed to fetch user info", isError: true });
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg({ text: "Not logged in", isError: true });
      return;
    }
    setChanging(true);
    setMsg(null);
    try {
      await changePassword(token, currentPassword, newPassword);
      setMsg({ text: "Password changed successfully", isError: false });
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setMsg({
        text: "Password change failed. Please check your current password.",
        isError: true,
      });
    } finally {
      setChanging(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[150px]">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        User Profile
      </h2>

      <div className="mb-8 space-y-2 text-gray-700 text-base">
        <p>
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {user.role}
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Change Password
      </h3>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block mb-1 font-medium text-gray-600"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength={6}
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block mb-1 font-medium text-gray-600"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={changing}
          className={`w-full py-2 rounded-md text-white font-semibold transition ${
            changing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {changing ? "Changing Password..." : "Change Password"}
        </button>
      </form>

      {msg && (
        <p
          className={`mt-4 text-center text-sm font-medium ${
            msg.isError ? "text-red-600" : "text-green-600"
          }`}
          role="alert"
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
