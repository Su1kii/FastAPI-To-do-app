import axios from "axios";
import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  description: string;
  priority: number;
  completed: boolean;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  // Utility to get styling based on priority
  const getPriorityStyle = (priority: number) => {
    if (priority >= 4) return "text-red-600 font-semibold";
    if (priority === 3) return "text-orange-500";
    return "text-green-600";
  };

  // Fetch todos from backend
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8000/todos/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTodos(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load todos");
        setLoading(false);
      });
  }, [token]);

  // Create new todo
  const createTodo = () => {
    axios
      .post(
        "http://localhost:8000/todos/todo",
        {
          title,
          description,
          priority,
          completed: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setTodos([...todos, res.data]);
        setTitle("");
        setDescription("");
        setPriority(1);
      });
  };

  // Toggle complete/incomplete
  const toggleComplete = (todo: Todo) => {
    axios
      .put(
        `http://localhost:8000/todos/todo/${todo.id}`,
        {
          ...todo,
          completed: !todo.completed,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setTodos(
          todos.map((t) =>
            t.id === todo.id ? { ...t, completed: !t.completed } : t
          )
        );
      });
  };

  // Delete todo
  const deleteTodo = (id: number) => {
    axios
      .delete(`http://localhost:8000/todos/todo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setTodos(todos.filter((t) => t.id !== id));
      });
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">📝 Your Todos</h2>

      {/* Create Todo */}
      <div className="space-y-2 mb-6">
        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          min={1}
          max={5}
          className="w-full p-2 border rounded"
          placeholder="Priority (1-5)"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={createTodo}
        >
          ➕ Add Todo
        </button>
      </div>

      {/* Todo List */}
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-start border rounded p-4"
          >
            <div className="w-full">
              <h3 className="text-lg font-semibold">{todo.title}</h3>
              <p className="text-sm text-gray-600">{todo.description}</p>
              <p className={getPriorityStyle(todo.priority)}>
                Urgency:{" "}
                {todo.priority >= 4
                  ? "🔥 Very High"
                  : todo.priority === 3
                  ? "⚠️ Medium"
                  : "🟢 Low"}
              </p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={todo.completed ? "text-green-600" : "text-red-600"}
                >
                  {todo.completed ? "Completed" : "Incomplete"}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => toggleComplete(todo)}
                className={`text-xs px-2 py-1 rounded ${
                  todo.completed
                    ? "bg-yellow-500 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {todo.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
