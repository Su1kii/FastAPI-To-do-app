import axios from "axios";

// Create an Axios instance to talk to your FastAPI backend at localhost:8000
const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: false, // JWT token will be sent manually in headers
});

// Login function: sends username & password as x-www-form-urlencoded (per OAuth2PasswordRequestForm)
export async function login(username: string, password: string) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const response = await API.post("/auth/token", params.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data; // { access_token: string, token_type: "bearer" }
}

// Signup function: sends JSON to /auth/ (your create user endpoint)
export async function signup(data: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
}) {
  const response = await API.post("/auth/", data);
  return response.data;
}

// Get current user info using JWT token stored in localStorage
export async function getCurrentUser(token: string) {
  const response = await API.get("/user/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Change password (requires current password and new password)
export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
) {
  await API.put(
    "/user/password",
    {
      password: currentPassword,
      new_password: newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export default API;
