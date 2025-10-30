<h1>🛍️ Your Own Shopping Store</h1>

<p>
<strong>Your Own Shopping Store</strong> is a full-stack e-commerce application built using the <strong>MERN-style</strong> approach — 
React (Vite) on the frontend, Express.js with Sequelize (PostgreSQL) on the backend, and Razorpay for payments.
It provides separate dashboards for both <strong>Users</strong> and <strong>Admins</strong>, enabling a complete online shopping experience.
</p>

<h2>🌐 Live Demo</h2>

<p>
Frontend (Netlify): <a href="https://yourownshoppingstore.netlify.app" target="_blank">https://yourownshoppingstore.netlify.app</a>  
<br/>
</p>

---

<h2>📚 Table of Contents</h2>

<ul>
  <li><a href="#features">✨ Features</a></li>
  <li><a href="#tech-stack">🧩 Tech Stack</a></li>
  <li><a href="#installation">⚙️ Installation</a></li>
  <li><a href="#usage">🚀 Usage</a></li>
  <li><a href="#folder-structure">📁 Folder Structure</a></li>
  <li><a href="#deployment">🌍 Deployment</a></li>
  <li><a href="#contributing">🤝 Contributions</a></li>
</ul>

---

<h2 id="features">✨ Features</h2>

<ul>
  <li><strong>👥 Authentication:</strong> Secure login, signup, password reset via email (Nodemailer).</li>
  <li><strong>🧑‍💼 Admin Dashboard:</strong> Add, edit, and manage products and orders.</li>
  <li><strong>🛒 User Dashboard:</strong> Browse products, add to cart, checkout, and view orders.</li>
  <li><strong>💳 Razorpay Integration:</strong> Seamless payment gateway for order checkout.</li>
  <li><strong>📦 Cart Management:</strong> Add/remove products with persistent cart state.</li>
  <li><strong>📱 Responsive Design:</strong> Fully optimized for mobile and desktop users.</li>
  <li><strong>⚙️ Role-based Routing:</strong> AdminRoute and ProtectedRoute for access control.</li>
</ul>

---

<h2 id="tech-stack">🧩 Tech Stack</h2>

**Frontend:**
- React 19 (Vite)
- React Router v7
- TailwindCSS
- Axios
- Framer Motion & Lucide React for UI/animations

**Backend:**
- Node.js + Express.js
- Sequelize ORM with PostgreSQL
- Razorpay for payments
- Multer for file uploads
- JSON Web Tokens (JWT) for authentication
- Dotenv for environment configuration

---

<h2 id="installation">⚙️ Installation</h2>

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Ashutosh9110/your_own_shopping_store.git
cd your_own_shopping_store
