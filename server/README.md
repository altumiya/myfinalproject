# Furniture Store Ecosystem

This repository is the backend API for a three-part furniture e-commerce project. The storefront, administration panel, and API are maintained in separate repositories and work together to provide the customer shopping experience and store management tools.

## Repositories

| Project | Description | Repository |
| --- | --- | --- |
| Furniture Storefront | Customer-facing store built with Next.js and React. | [altumiya/furniture-app](https://github.com/altumiya/furniture-app) |
| Admin Panel | React and Vite dashboard for managing products, orders, customers, and store content. | [altumiya/adminpanel](https://github.com/altumiya/adminpanel) |
| API Server (this repository) | Express and MongoDB backend serving the storefront and admin panel. | [altumiya/server](https://github.com/altumiya/server) |

## Architecture

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
```

The API exposes customer routes under `/api/web` and administration routes under `/api/admin`. It also serves uploaded product, category, slider, testimonial, and profile images from `/uploads/...` paths.

## API Server Setup

### Requirements

- Node.js and npm
- MongoDB running locally (the current database connection uses `mongodb://127.0.0.1:27017/`)

### Install and run

```bash
git clone https://github.com/altumiya/server.git
cd server
npm install
```

Create a local `.env` file with the configuration expected by the server:

```env
PORT=8000
DBNAME=furniture_store
ADMINEMAIL=admin@example.com
ADMINPASSWORD=replace-with-a-strong-password
```

Keep credentials private. Do not commit real secrets or share them in public issues or logs. Then start the server:

```bash
npm start
```

The package's `start` script runs `nodemon`; the API listens on the configured `PORT` after connecting to MongoDB.

## Running the Other Projects

### Storefront

```bash
git clone https://github.com/altumiya/furniture-app.git
cd furniture-app
npm install
npm run dev
```

Open `http://localhost:3000`.

### Admin Panel

```bash
git clone https://github.com/altumiya/adminpanel.git
cd adminpanel
npm install
```

Set the API URL in the admin panel's local `.env` file:

```env
VITE_APIBASEURL=http://localhost:8000/api/admin
```

Then run `npm run dev` and open the local URL printed by Vite (typically `http://localhost:5173`). Start the API server and MongoDB before using either frontend.

## API Route Groups

- `/api/web/auth` — customer account and authentication routes
- `/api/web/home` — storefront home data
- `/api/web/product` — customer product routes
- `/api/web/cart` and `/api/web/wishlist` — shopping cart and wishlist
- `/api/web/order` and `/api/web/faq` — customer orders and FAQs
- `/api/admin` — admin management routes for catalog, orders, profiles, and store content

## Technology

- Storefront: Next.js, React, Redux Toolkit, Tailwind CSS
- Admin panel: React, Vite, React Router, Tailwind CSS
- API server: Node.js, Express, Mongoose, MongoDB

## Notes

- The API's database connection currently targets a local MongoDB instance. Update the connection configuration if using a hosted database.
- Configure CORS appropriately when deploying the frontends and API to different origins.
- This repository contains no automated test suite configured in `package.json`.
