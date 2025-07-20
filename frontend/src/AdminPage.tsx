import axios from "axios";
import { useEffect, useState } from "react";

type TodoAdmin = {
  id: number;
  title: string;
  description: string;
  priority: number;
  completed: boolean;
  owner_id: number;
};

export default function AdminPage() {
  const [todos, setTodos] = useState<TodoAdmin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch todos
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8000/admin/todo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTodos(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unauthorized or failed to load admin data");
        setLoading(false);
      });
  }, [token]);

  // Handle delete action
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      await axios.delete(`http://localhost:8000/admin/todo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove deleted todo from state
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      alert("Failed to delete todo. Make sure you have admin rights.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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

  if (error)
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded max-w-md mx-auto mt-8">
        {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Admin Dashboard - All Todos
      </h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner ID
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {todos.map((todo) => (
              <tr key={todo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {todo.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  {todo.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {todo.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      todo.priority >= 4
                        ? "bg-red-200 text-red-800"
                        : todo.priority >= 2
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {todo.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {todo.completed ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Incomplete
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {todo.owner_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {todos.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-500 py-4 italic"
                >
                  No todos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
