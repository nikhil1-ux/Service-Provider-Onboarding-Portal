# Service Provider Onboarding Portal

A full-stack **MERN** application that digitizes the onboarding process for service providers — similar in spirit to platforms like Urban Company or ExtraHand. Service providers can register, build out their profile, upload verification documents, and track their application status, while admins can review, approve, or reject applications from a dedicated dashboard.

**Live demo:** https://service-provider-onboarding-portal-five.vercel.app

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Overview](#api-overview)
- [Screenshots](#screenshots)
- [Demo Video](#demo-video)
- [Roadmap / Bonus Features](#roadmap--bonus-features)
- [License](#license)

---

## Features

### Service Provider
- Register & Login (JWT-based authentication)
- Complete profile setup
- Select service categories
- Add skills & experience
- Add service location
- Upload profile photo & verification documents
- View real-time application status
- Edit profile before approval

### Admin
- Secure admin login
- View all registered providers
- Search & filter providers
- View uploaded documents
- Approve / reject applications
- Add rejection remarks
- View dashboard statistics

### Platform-wide
- Role-based access control (Admin / Provider)
- Protected routes on frontend & backend
- Pagination on listing views
- Form validation (client & server side)
- File upload handling
- Modular, scalable folder structure
- Centralized error handling
- Responsive UI across devices

---

## Tech Stack

| Layer            | Technology                                  |
|-------------------|----------------------------------------------|
| Frontend          | React                                        |
| Backend           | Node.js, Express                             |
| Database          | MongoDB (Mongoose ODM)                       |
| Authentication    | JWT (JSON Web Tokens)                        |
| File Uploads      | Multer (or equivalent middleware)            |
| API Style         | REST                                         |
| Deployment        | Vercel (Frontend) / Render / Railway (Backend)|

---

## Project Structure

```
Service-Provider-Onboarding-Portal/
├── Backend/                 # Express server, REST APIs, MongoDB models
│   ├── src/ or root files   # controllers, routes, models, middleware, config
│   ├── .env.example
│   └── package.json
├── Frontend/                # React application
│   ├── src/                 # components, pages, services, context/hooks
│   ├── .env.example
│   └── package.json
└── README.md
```

> Note: Exact internal folder names may vary — see each subfolder for its own structure.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- npm or yarn

### Clone the repository

```bash
git clone https://github.com/nikhil1-ux/Service-Provider-Onboarding-Portal.git
cd Service-Provider-Onboarding-Portal
```

### Install dependencies

```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

---

## Environment Variables

Create a `.env` file in both `Backend/` and `Frontend/` based on the provided `.env.example` files.

**Backend/.env**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
# Add file upload / cloud storage keys if applicable (e.g. Cloudinary)
```

**Frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> Update variable names above to match your actual `.env.example` files if they differ.

---

## Running the App

### Start the backend

```bash
cd Backend
npm run dev
```

### Start the frontend

```bash
cd Frontend
npm start
```

The frontend will typically run on `http://localhost:3000` and the backend API on `http://localhost:5000`.

---

## API Overview

All endpoints are prefixed with `/api`.

| Module        | Example Endpoints                                              |
|----------------|------------------------------------------------------------------|
| Auth           | `POST /api/auth/register`, `POST /api/auth/login`               |
| Provider       | `GET /api/providers/me`, `PUT /api/providers/me`, `POST /api/providers/documents` |
| Admin          | `GET /api/admin/providers`, `PUT /api/admin/providers/:id/approve`, `PUT /api/admin/providers/:id/reject` |
| Dashboard      | `GET /api/admin/stats`                                          |



## Roadmap / Bonus Features

- [ ] Email notifications on status change
- [ ] Google OAuth login
- [ ] Docker support
- [ ] Swagger API documentation
- [ ] Dark mode
- [x] Deployment (frontend live on Vercel)

---

## License

This project was built as part of a MERN Stack Intern Assignment and is available for learning and reference purposes.
