# Furniture Store Ecosystem

A comprehensive, full-stack furniture e-commerce project. This repository is a monorepo containing three integrated applications: a customer storefront, an administration dashboard, and a backend API. Together, they provide a complete shopping experience and store management system.

## 📦 Project Structure

| Folder | Description | Tech Stack |
| :--- | :--- | :--- |
| `/furniture-app` | **Customer Storefront:** The public-facing e-commerce web application. | Next.js, React, Redux Toolkit, Tailwind CSS |
| `/adminpanel` | **Admin Dashboard:** The management portal for catalog, orders, and content. | React, Vite, React Router, Tailwind CSS |
| `/server` | **API Server:** The centralized backend serving both the storefront and admin panel. | Node.js, Express, MongoDB, Mongoose |

---

## 🏗️ Architecture

```text
┌─────────────────────┐       ┌─────────────────────┐
│ Furniture Storefront│       │    Admin Panel      │
│ Next.js / React     │       │    React / Vite     │
└──────────┬──────────┘       └──────────┬──────────┘
           │                              │
           └──────────────┬───────────────┘
                          ▼
              ┌─────────────────────┐
              │ API Server          │
              │ Express / Node.js   │
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │ MongoDB             │
              └─────────────────────┘
🚀 Getting Started
Prerequisites
Before running the ecosystem, make sure you have:

Node.js (v18 or later)

npm or yarn

MongoDB (Running locally on mongodb://127.0.0.1:27017/ or via MongoDB Atlas)

First, clone the entire repository:

Bash
git clone [https://github.com/yourusername/YOUR-NEW-REPO-NAME.git](https://github.com/yourusername/YOUR-NEW-REPO-NAME.git)
cd YOUR-NEW-REPO-NAME
1. API Server Setup (/server)
The API exposes customer routes under /api/web and administration routes under /api/admin. It also serves uploaded images from /uploads/....

Installation & Configuration:

Bash
cd server
npm install
Create a .env file inside the /server folder with the following credentials:

Code snippet
PORT=8000
DBNAME=furniture_store
ADMINEMAIL=admin@example.com
ADMINPASSWORD=replace-with-a-strong-password
Start the Server:

Bash
npm start
The API will connect to MongoDB and run on http://localhost:8000.

2. Admin Panel Setup (/adminpanel)
Provides tools for catalog administration (products, categories, attributes), order/customer oversight, and UI content management (sliders, testimonials, FAQs).

Installation & Configuration:
Open a new terminal window and run:

Bash
cd adminpanel
npm install
Create a .env file inside the /adminpanel folder:

Code snippet
VITE_APIBASEURL=http://localhost:8000/api/admin
Start the Admin Dashboard:

Bash
npm run dev
The Admin Panel will run on http://localhost:5173.

3. Furniture Storefront Setup (/furniture-app)
A modern shopping app featuring product browsing, a shopping cart, wishlists, secure checkout, and user account management. Uses Framer Motion for animations and Redux for state management.

Installation & Configuration:
Open a third terminal window and run:

Bash
cd furniture-app
npm install
Start the Storefront:

Bash
npm run dev
The Storefront will run on http://localhost:3000.

🛠️ Tech Stack Details
Storefront (furniture-app)

Next.js 16 (App Router) & React 19

Redux Toolkit (Cart, Wishlist, User state)

Tailwind CSS, Framer Motion, Swiper

Axios, SweetAlert2, React Toastify

Admin Dashboard (adminpanel)

React 19 & Vite 8

React Router

Tailwind CSS 4

Axios, React Toastify

Backend API (server)

Node.js & Express

MongoDB & Mongoose

Route Groups: /api/web/auth, /api/web/home, /api/web/product, /api/web/cart, /api/web/order, /api/admin

📝 Notes
Database: The API's database connection currently targets a local MongoDB instance. Update the server code if using a hosted database.

CORS: Ensure CORS is configured appropriately in the Express server when deploying the frontends and API to different domains.

License: This project does not currently include a license file. Add an appropriate license before public distribution.
