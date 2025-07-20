import { useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AdminPage from "./AdminPage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import TodosPage from "./TodosPage";
import UserProfile from "./UserProfile";

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("role") === "admin"
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <div>
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="text-xl font-bold tracking-wide">📝 Todo App</div>
        <div className="space-x-4 text-sm sm:text-base">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/todos" className="hover:underline">
                Todos
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hover:underline">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <LoginForm
              onLogin={(token, role) => {
                setIsLoggedIn(true);
                setIsAdmin(role === "admin");
                navigate("/todos");
              }}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupForm
              onSignup={(token, role) => {
                setIsLoggedIn(true);
                setIsAdmin(role === "admin");
                navigate("/todos");
              }}
            />
          }
        />
        <Route
          path="/todos"
          element={
            <RequireAuth>
              <TodosPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
