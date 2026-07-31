# 🚀 Service Provider Onboarding Portal

<p align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

</p>

A **full-stack MERN application** that streamlines the onboarding process for service providers similar to platforms like **Urban Company**.

The platform enables providers to register, complete their profiles, upload verification documents, and track their application status. Administrators can efficiently review applications, verify documents, approve or reject providers, and monitor platform statistics through a dedicated dashboard.

---

# 🌐 Live Demo

### Frontend

https://service-provider-onboarding-portal-five.vercel.app

### Backend API

https://service-provider-onboarding-portal.onrender.com

---

# 🎥 Demo Video

> Add your Loom or YouTube video here

```
https://your-demo-video-link
```

---

# ✨ Features

## 👨‍🔧 Service Provider

* Secure Registration & Login
* JWT Authentication
* Complete Professional Profile
* Upload Profile Picture
* Upload Verification Documents
* Add Skills & Experience
* Choose Service Categories
* Service Location Management
* Track Application Status
* Edit Profile Before Approval

---

## 👨‍💼 Admin Panel

* Secure Admin Authentication
* Dashboard Statistics
* Search Providers
* Filter Applications
* View Uploaded Documents
* Approve Applications
* Reject Applications
* Add Rejection Remarks
* Manage Provider Profiles

---

## 🔐 Security

* JWT Authentication
* Protected Routes
* Role-Based Access Control
* Password Hashing
* Input Validation
* Error Handling Middleware

---

# 🛠 Tech Stack

| Category       | Technology          |
| -------------- | ------------------- |
| Frontend       | React, React Router |
| Backend        | Node.js, Express.js |
| Database       | MongoDB + Mongoose  |
| Authentication | JWT                 |
| File Upload    | Multer              |
| Styling        | CSS                 |
| API            | REST API            |
| Deployment     | Vercel, Render      |

---

# 📂 Project Structure

```text
Service-Provider-Onboarding-Portal
│
├── Backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── models
│   ├── config
│   ├── utils
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── Frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── hooks
│   │   ├── services
│   │   └── assets
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/nikhil1-ux/Service-Provider-Onboarding-Portal.git

cd Service-Provider-Onboarding-Portal
```

---

## Install Backend

```bash
cd Backend

npm install
```

---

## Install Frontend

```bash
cd ../Frontend

npm install
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=5000

MONGODB_URI=your_database_url

JWT_SECRET=your_secret

JWT_EXPIRY=7d

CLIENT_URL=http://localhost:5173
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# ▶️ Run Locally

### Backend

```bash
cd Backend

npm run dev
```

Backend runs at

```
http://localhost:5000
```

---

### Frontend

```bash
cd Frontend

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |
| GET    | `/api/auth/profile`  |

---

## Provider

| Method | Endpoint                      |
| ------ | ----------------------------- |
| GET    | `/api/provider/profile`       |
| PUT    | `/api/provider/profile`       |
| POST   | `/api/provider/photo`         |
| POST   | `/api/provider/documents`     |
| DELETE | `/api/provider/documents/:id` |
| POST   | `/api/provider/submit`        |
| GET    | `/api/provider/status`        |

---

## Admin

| Method | Endpoint                           |
| ------ | ---------------------------------- |
| GET    | `/api/admin/dashboard`             |
| GET    | `/api/admin/providers`             |
| GET    | `/api/admin/providers/:id`         |
| PUT    | `/api/admin/providers/:id/approve` |
| PUT    | `/api/admin/providers/:id/reject`  |

---

# 📸 Screenshots

## Home Page

```md
![Home](assets/home.png)
```

---

## Login

```md
![Login](assets/login.png)
```

---

## Provider Dashboard

```md
![Dashboard](assets/dashboard.png)
```

---

## Admin Dashboard

```md
![Admin](assets/admin-dashboard.png)
```

---

## Application Status

```md
![Status](assets/status.png)
```

---

# 🔄 Application Workflow

```text
Register
      │
      ▼
Login
      │
      ▼
Complete Profile
      │
      ▼
Upload Documents
      │
      ▼
Submit Application
      │
      ▼
Admin Review
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Approved  Rejected
```

---

# 🚀 Future Improvements

* Email Notifications
* Google OAuth
* Docker Support
* Swagger Documentation
* Dark Mode
* Cloud Storage Integration
* Real-Time Notifications
* Admin Analytics
* Audit Logs

---

# 💡 Highlights

* Clean MVC Architecture
* RESTful API Design
* Scalable Folder Structure
* Reusable Components
* Secure Authentication
* Responsive User Interface
* Centralized Error Handling
* Production Deployment

---

# 👨‍💻 Author

**Nikhil Yadav**

GitHub

https://github.com/nikhil1-ux

LinkedIn

https://linkedin.com/in/nikhilyadav-dev

---

# 📜 License

This project was developed as part of a **MERN Stack Internship Assignment** and is intended for learning, demonstration, and portfolio purposes.
