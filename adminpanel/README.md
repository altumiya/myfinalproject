# Furniture Store Admin Panel

A React-based admin dashboard for managing the furniture storefront. The panel provides tools for catalog administration, order and customer oversight, and maintenance of the content displayed by the store.

## Features

- Admin login and dashboard overview
- Manage products, categories, subcategories, and nested subcategories
- Manage product attributes such as colors, materials, and countries
- View and manage orders and registered users
- Manage sliders, testimonials, FAQs, and “Why Choose Us” content
- Review contact enquiries and newsletter subscriptions
- Edit admin and company profiles
- Client-side routing with React Router
- API requests with Axios and toast notifications

## Tech Stack

- React 19
- Vite 8
- React Router
- Tailwind CSS 4
- Axios
- React Icons
- React Toastify

## Prerequisites

- Node.js and npm
- The [Furniture Store API](https://github.com/altumiya/server) running and reachable from the browser

## Getting Started

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/altumiya/adminpanel.git
   cd adminpanel
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the API base URL in a root-level `.env` file. Vite exposes this variable to the client, so use a non-secret API URL only:

   ```env
   VITE_APIBASEURL=http://localhost:8000/api/admin
   ```

   The dashboard also uses the web API under `/api/web`; it derives the common API root from this admin URL.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open the local URL printed by Vite (by default, `http://localhost:5173`).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```text
src/
├── App.jsx                  # Routes for login and admin pages
├── App.css
├── main.jsx                 # React application entry point
└── components/pages/         # Login, dashboard, catalog, orders, profiles, and content tools
```

## Related Project

The API used by this panel is maintained in [altumiya/server](https://github.com/altumiya/server). Make sure the API is configured to allow requests from the admin panel's origin.

## License

No license file is currently included in this repository. Add a license if you plan to distribute or reuse the project.
