<h1>Your Own Shopping Store</h1>

<p>
<strong>Your Own Shopping Store</strong> is a full-stack e-commerce web application built using the <strong>MERN-style</strong> stack — 
React (Vite) for the frontend, Express.js + Sequelize (PostgreSQL) for the backend, and Razorpay for payments.
It provides separate dashboards for both <strong>Users</strong> and <strong>Admins</strong>, enabling a complete online shopping experience.
</p>

---

<h2>Live Demo</h2>

Frontend (Netlify): [https://yourownshoppingstore.netlify.app](https://yourownshoppingstore.netlify.app)  

---

<h2>📚 Table of Contents</h2>

<ul>
  <li><a href="#features">Features</a></li>
  <li><a href="#tech-stack">Tech Stack</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#folder-structure">Folder Structure</a></li>
  <li><a href="#deployment">Deployment</a></li>
  <li><a href="#contributing">Contributions</a></li>
</ul>

---

<h2 id="features">Features</h2>

<ul>
  <li><strong>Authentication:</strong> Secure login, signup, and password reset via email (Nodemailer).</li>
  <li><strong>Admin Dashboard:</strong> Add, edit, and manage products and view orders.</li>
  <li><strong>User Dashboard:</strong> Browse products, add to cart, and checkout.</li>
  <li><strong>Razorpay Integration:</strong> Seamless payment gateway for order checkout.</li>
  <li><strong>Cart Management:</strong> Add/remove products with persistent cart state.</li>
  <li><strong>Responsive Design:</strong> Fully optimized for mobile and desktop users.</li>
  <li><strong>Role-based Routing:</strong> ProtectedRoute and AdminRoute for access control.</li>
</ul>

---

<h2 id="tech-stack">Tech Stack</h2>

**Frontend:**
- React 19 (Vite)
- React Router v7
- TailwindCSS
- Axios
- Framer Motion & Lucide React (UI/animations)

**Backend:**
- Node.js + Express.js
- Sequelize ORM + PostgreSQL
- Razorpay SDK for payments
- Multer for file uploads
- JWT for authentication
- Dotenv for configuration

---

<h2 id="installation">Installation</h2>

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Ashutosh9110/your_own_shopping_store.git
cd your_own_shopping_store

2️⃣ Install dependencies
Backend
cd backend
npm install

Frontend
cd frontend
npm install

3️⃣ Setup environment variables
Create a .env file inside the backend/ folder:

PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

<h2 id="usage">Usage</h2>

Run the backend
cd backend
npm run dev

Run the frontend
cd frontend
npm run dev

Then open your browser and visit:
http://localhost:5173



your_own_shopping_store/
│
├── backend/
│   ├── app.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── middlewares/
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md

```

<h2 id="deployment">Deployment</h2>

Frontend:
Deployed on Netlify
.
Set environment variables in Netlify settings for API endpoints.

Backend:
Deployed on Render
.
Make sure to:

Set start script in package.json to "node app.js"

Add environment variables in Render dashboard.

Use PostgreSQL Render instance or external database.


<h2 id="contributing">Contributions</h2>

Contributions are welcome!

To contribute:
```

# Fork the repository
# Create your feature branch
git checkout -b feature/new-feature

# Commit your changes
git commit -m "Added new feature"

# Push to the branch
git push origin feature/new-feature

# Create a Pull Request
```
  
<h3 align="center">👨Developed by <strong>Ashutosh Singh</strong></h3> <p align="center"> Check out more of my work at
my <a href="https://work-with-ashutosh.netlify.app/" target="_blank" rel="noopener noreferrer">Portfolio</a>! </p> 

