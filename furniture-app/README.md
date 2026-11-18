# Furniture App

A modern furniture e-commerce storefront built with Next.js and React. The app includes browsing, product details, cart, wishlist, checkout, user authentication flows, and a polished storefront experience for shoppers.

## Overview

This project is a furniture shopping application designed to showcase and sell home and office furniture items. It includes a marketing homepage, category/product browsing, customer testimonials, shopping cart, wishlist, checkout flow, and user account features.

## Features

- Responsive storefront with hero banners and promotional sections
- Product catalog with featured items and category browsing
- Product detail pages and shopping flow
- Cart and wishlist management with Redux state
- User login/register and password reset flows
- Checkout and thank-you experience
- About, FAQ, contact, privacy, and terms pages
- Animated UI with Framer Motion and Swiper
- Built with Next.js App Router

## Tech Stack

- Next.js 16
- React 19
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- Swiper
- Axios
- React Icons
- SweetAlert2, React Toastify, Izitoast

## Project Structure

```bash
furniture-app/
├── public/
│   ├── about-us/
│   ├── banner1.webp
│   ├── banner2.webp
│   ├── furniture-products.json
│   ├── logo.png
│   ├── slider1.jpg
│   ├── slider2.jpg
│   ├── slider3.jpg
│   └── ...
├── src/
│   ├── app/
│   │   ├── (withheader)/
│   │   │   ├── about-us/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── contact-us/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── product/
│   │   │   ├── register/
│   │   │   ├── wishlist/
│   │   │   ├── page.js
│   │   │   └── layout.js
│   │   ├── (withoutheader)/
│   │   ├── components/
│   │   ├── globals.css
│   │   └── favicon.ico
│   ├── redux/
│   │   ├── cartSlice.js
│   │   ├── store.js
│   │   ├── userSlice.js
│   │   └── wishlistSlice.js
│   └── proxy.js
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
└── package-lock.json
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18 or later
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/altumiya/furniture-app.git
cd furniture-app
```

2. Install dependencies:

```bash
npm install
```

## Running the App

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

## Linting

```bash
npm run lint
```

## Notes

- The project uses the Next.js App Router and route groups for layout variations.
- Product data is served from the app and public assets, including a JSON-based catalog.
- Redux is used for cart, wishlist, and user state management.

## License

This project does not currently include a license file. If you are publishing or distributing it, add an appropriate license before release.

## Author

Built for a furniture storefront use case with a modern, responsive e-commerce UI.
