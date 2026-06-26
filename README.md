# ThreadMarket SaaS

ThreadMarket is a premium, high-performance web application designed for modern fashion boutiques and multi-vendor clothing platforms. Built entirely on the MERN stack (MongoDB, Express, React, Node.js), it features a highly dynamic and interactive user interface powered by Framer Motion, fully optimized APIs, and a robust administrative dashboard with Kanban-style order management.

This platform bridges the gap between high-end aesthetic design and scalable backend infrastructure, making it the perfect foundation for boutique e-commerce and fashion SaaS platforms.

---

## 🛠️ Technology Stack

**Frontend:**
- **React.js + Vite** for blazing fast compilation and rendering.
- **Tailwind CSS** for modern, responsive glassmorphism UI.
- **Framer Motion** for GPU-accelerated micro-interactions and scroll animations.
- **Zustand** for lightweight, persistent global state management (Auth).
- **@hello-pangea/dnd** for the drag-and-drop Kanban interface.
- **Axios** for API communication with global interceptors.

**Backend:**
- **Node.js & Express** for robust REST API creation.
- **MongoDB & Mongoose** for NoSQL data modeling with strict schema validation.
- **JSON Web Tokens (JWT)** for secure, stateless authentication.
- **Bcrypt** for cryptographic password hashing.

---

## ✨ Core Features & Functionality

### 🛍️ Public Storefront
- **Dynamic Hero Interface:** Features an immersive video background with premium typography.
- **Product Discovery:** Advanced filtering system (by price, category) and sorting capabilities (Newest, Price High/Low).
- **Interactive Product Cards:** 3D tilt effects, quick-view badges, and dynamic pricing tags.
- **Performance Optimized:** `Promise.all` parallel data fetching and native HTML5 lazy-loading for media assets to ensure instant page paints.

### 🔐 Admin Dashboard
- **Role-Based Access Control:** Secure, protected routes accessible only to authorized administrators.
- **Kanban Order Management:** A fully interactive Drag-and-Drop board to visually manage order statuses (Pending -> Approved -> Packed -> Dispatched -> Delivered).
- **Real-Time Analytics:** Dashboard aggregates live revenue, order counts, and active customers from the database.
- **Automated Workflows:** Moving an order to 'Delivered' automatically updates its payment status in the database.

### 🛡️ Security Architecture
- **Split-Token Authentication:** Uses short-lived access tokens stored in memory, backed by secure, 7-day `HttpOnly` refresh cookies.
- **NoSQL Injection Prevention:** Custom Express 5 compatible middleware strips malicious MongoDB operators from incoming requests.
- **DDoS Protection:** `express-rate-limit` throttles excessive API requests.
- **HTTP Header Hardening:** Configured with `helmet` to mitigate cross-site scripting (XSS) and clickjacking.

---

## 🚀 Local Installation & Setup

Want to run ThreadMarket on your local machine? Follow these steps:

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas URI)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/threadmarket.git
cd threadmarket
```

### 2. Setup the Backend
Open a new terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

Seed the database with sample data and start the server:
```bash
npm run data:import
npm run dev
```
*The API will start running on `http://localhost:5000`*

### 3. Setup the Frontend
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*The React app will start running on `http://localhost:5173`*

### 4. Admin Access
Once both servers are running, you can access the admin dashboard by navigating to `http://localhost:5173/admin/login` and logging in with the seeded admin credentials:
- **Email:** `admin@threadmarket.com`
- **Password:** `adminpassword123`

---

## 📜 License
Built with ☕ & 🤍 by Rizwan Khan
