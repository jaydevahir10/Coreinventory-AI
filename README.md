# 🚀 CoreInventory AI

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![Node](https://img.shields.io/badge/Backend-Node.js-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

**CoreInventory AI** is a modern **Inventory Management System** built using the **MERN Stack**.

It helps businesses manage **products, warehouses, stock movements, and inventory transfers** with secure authentication and real-time updates.

---

# 📸 Screenshots

(Add screenshots of your application UI)

### Login Page

![Login](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Product Management

![Products](screenshots/products.png)

### Stock Transfer

![Transfer](screenshots/transfer.png)

---

# ✨ Features

✔ Secure Authentication (JWT)
✔ Role Based Access (Admin / Manager / Staff)
✔ Product Management
✔ Warehouse Management
✔ Stock Transfers Between Warehouses
✔ Inventory Tracking
✔ Real-time Updates using Socket.IO
✔ Dashboard with Stock Insights

---

# 🧠 Tech Stack

### Frontend

* React.js
* Axios
* React Router
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO

---

# 📂 Project Structure

```
coreinventory-ai
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── services
│   │   └── App.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/jaydevahir10/coreinventory-ai.git
cd coreinventory-ai
```

---

# 📦 Install Dependencies

### Backend

```
cd backend
npm install
```

### Frontend

```
cd frontend
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside **backend**

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

---

# ▶️ Run Project

### Start Backend

```
cd backend
npm run dev
```

Server runs on

```
http://localhost:5000
```

---

### Start Frontend

Open another terminal

```
cd frontend
npm start
```

Frontend runs on

```
http://localhost:3000
```

---

# 🔑 Demo Login

```
Email: admin@test.com
Password: password123
```

---

# 📡 API Routes

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Products

```
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

### Warehouses

```
GET /api/warehouses
POST /api/warehouses
```

### Stock Movement

```
POST /api/movements/transfer
GET /api/movements
```

---

# 🚀 Future Improvements

* 📊 AI Demand Forecasting
* 🔔 Low Stock Alerts
* 📱 Mobile App
* 📦 Barcode Scanner
* 📄 Export Reports (PDF / Excel)
* ☁ Cloud Deployment

---

# 👨‍💻 Author

**Jaydev Ahir-Indus University**
IU2441230144

GitHub
[https://github.com/jaydevahir10](https://github.com/jaydevahir10)

---

# 📜 License

MIT License

---

# ⭐ Support

If you like this project:

⭐ Star the repository
🍴 Fork it
🛠 Contribute improvements

