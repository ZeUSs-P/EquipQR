# 🏋️‍♂️ EquipQR – Smart Sports Equipment Management System

> **EquipQR** is a full-stack web application designed to simplify how colleges manage their sports equipment.  
> It enables **students to book equipment** seamlessly and **admins to track, issue, and collect** items using QR codes.

---

## 🚀 Features

### 👨‍🎓 **Student Dashboard**
- Browse all available sports equipment.
- Book items in real time.
- Check your booking status (`Pending`, `Approved`, `Returned`).
- Cancel or return equipment directly from the dashboard.

### 🧑‍💼 **Admin Panel**
- View and manage all bookings.
- Approve or reject requests instantly.
- Scan QR codes to verify returns or issues.
- Auto-delete pending requests after 2 minutes.
- One-click status update (with protection against multiple clicks).

### 🔐 **Authentication & Access**
- Secure JWT-based login system.
- Separate access levels for Admins and Students.
- Protected routes for backend APIs.

### 🧾 **Smart Booking Rules**
- One sport per user at a time.
- Only one of each item per booking.
- Real-time stock tracking with automatic updates.

### 🧠 **System Intelligence**
- Automatically removes unapproved requests after 2 minutes.
- Prevents duplicate or spam bookings.
- Prevents stock duplication on repeated admin clicks.

---

## 🏗️ Tech Stack

| Layer | Technology Used |
|-------|------------------|
| **Frontend** | React.js, React Router, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT (JSON Web Token) |
| **QR Generation** | `qrcode` NPM package |
| **Deployment** | Vercel (Frontend) & Render / Railway (Backend) |

---

## 📱 Screenshots

| Login Page | Student Dashboard | Admin Panel |
|-------------|------------------|--------------|
| ![Login](assets/login.png) | ![Dashboard](assets/student.png) | ![Admin](assets/admin.png) |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/EquipQR.git
cd EquipQR
