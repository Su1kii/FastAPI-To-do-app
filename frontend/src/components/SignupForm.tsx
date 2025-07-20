import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";

type SignupFormProps = {
  onSignup?: (token: string, role: string) => void; // callback to notify parent on success
};

export default function SignupForm({ onSignup }: SignupFormProps) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "user", // backend will override if needed
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);
    try {
      const data = await signup(form);

      // Save token & role in localStorage (assumes backend returns these)
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role || "user");

      setMessage("✅ Signup successful! Redirecting...");

      if (onSignup) {
        onSignup(data.access_token, data.role || "user");
      }

      // Redirect to todos page after short delay
      setTimeout(() => navigate("/todos"), 1000);
    } catch (error: any) {
      setIsError(true);
      setMessage(error.response?.data?.detail || "❌ Signup failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {message && (
          <p
            className={`text-sm mt-2 ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
