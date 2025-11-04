# 💻 Inventory Management System (IMS)

An integrated **Inventory Management System (IMS)** built with **React + Vite** for the frontend and **Spring Boot** for the backend.  
The system helps administrators manage laptops, assignments, returns, leasing, and repair records efficiently.

---

## 🚀 Features

### 🖥️ Frontend (React + Vite)
- Modern, responsive dashboard UI
- Sidebar navigation with smooth animations
- Pages:
  - **Dashboard** – Overview of system data
  - **Master Laptop** – Manage laptop inventory and specifications
  - **Assign & Return** – Track laptop assignments and returns
  - **Return Leasing** – Manage leased laptops
  - **Repair Record** – Record and track repairs
  - **Profile** – Admin profile management (edit name, email, password)
- Built with:
  - **React + Vite**
  - **Tailwind CSS** for styling
  - **Framer Motion** for animations
  - **Lucide React / React Icons** for icons
  - **Axios** for API communication

### ⚙️ Backend (Spring Boot)
- RESTful API design
- JWT-based authentication
- Role-based authorization
- MySQL database integration via **Spring Data JPA**
- Entities: `AppUser`, `UserRole`, `MasterLaptop`, `AssignRecord`, `RepairRecord`
- Exception handling and validation support

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Spring Boot 3, Spring Security, JPA/Hibernate |
| **Database** | MySQL |
| **Build Tools** | Maven (backend), npm (frontend) |
| **API Communication** | Axios |
| **Auth** | JWT (JSON Web Token) |


