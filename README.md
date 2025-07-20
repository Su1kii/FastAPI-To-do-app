# 🚀 FastAPI To-do App — The Ultimate Productivity Booster

![Todo App Screenshot](todoapp.png)

---

## 🎯 What Is This?

Welcome to **FastAPI To-do App** — your sleek, modern, full-stack productivity companion designed to help you manage tasks effortlessly! Powered by a blazing FastAPI backend and a responsive React frontend, this app lets you sign up, log in, and organize your todos with ease.

Whether you're a casual user or an admin, you’ll enjoy smooth, secure experiences tailored just for you.

---

## ✨ Features That Shine

- 🔐 **Secure Authentication** with JWT tokens — log in with confidence!
- 🛡️ **Role-Based Access Control** — Users & Admins get exactly what they need.
- 📝 **Full CRUD**: Create, Read, Update, and Delete your todos effortlessly.
- 📱 **Responsive & Stylish UI** built with React and TailwindCSS — works perfectly on any device.
- 🔄 **Password Management** — change your password anytime, securely.
- 🛠️ **Admin Dashboard** — oversee, manage, and delete any todos for ultimate control.

---

## 🛠️ Technologies Under the Hood

| Frontend                  | Backend                      | Database      | Authentication     |
|---------------------------|------------------------------|---------------|--------------------|
| React + React Router      | FastAPI                      | SQLite        | JWT (JSON Web Token)|
| Axios (API requests)      | SQLAlchemy (ORM)             |               | Password hashing    |
| TailwindCSS (styling)     | Pydantic (data validation)   |               |                    |

---

## 🚀 Getting Started

### Backend Setup

```bash
# Create virtual env & install dependencies
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate.bat     # Windows
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload
