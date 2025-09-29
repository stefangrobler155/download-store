# ImageVault: Headless WooCommerce E-Commerce Demo

## Overview
A React-based frontend for a headless WordPress WooCommerce store, built to learn and demonstrate the e-commerce flow: browsing products, managing cart, checkout (with Cash on Delivery), order confirmation, and downloading virtual files. Focuses on integrating with the WP REST API for a decoupled architecture—backend handles data/security, frontend manages UI/state.

Key Learnings:
- Headless CMS integration via REST API.
- User auth (login/signup with JWT).
- Client-side cart/wishlist management.
- Protected routes and order dashboard.

Live Demo: [[Link to deployed site, e.g., Vercel/Netlify](https://download-store-gamma.vercel.app/)]
Screenshot: ![Homepage](path/to/homepage-screenshot.png)

## Tech Stack
| Category | Tools |
|----------|-------|
| Frontend | React, React Router, Toastify |
| API/Backend | WordPress WooCommerce REST API (headless mode) |
| State Management | useState, localStorage |
| Styling | CSS (custom variables, responsive clamps) |
| Other | Axios (implied for API calls), JWT for auth |

## Features
- **Product Browsing**: Fetch and display categories/products (e.g., Nature, Portraits).
- **Cart & Wishlist**: Add/remove items, persist in localStorage.
- **Auth**: Login/signup/logout, protected checkout/dashboard.
- **Checkout & Orders**: Submit orders via API, view confirmations, download virtual files (works with COD).
- **Dashboard**: List user orders.

## Installation & Setup
1. Clone repo: `git clone https://github.com/stefangrobler155/download-store`
2. Install dependencies: `npm install`
3. Set up WordPress/WooCommerce backend:
   - Install WooCommerce plugin.
   - Enable REST API (with authentication, e.g., JWT plugin).
   - Add products (mark as virtual/downloadable).
   - Configure COD gateway.
4. Update `utils/api.js` with your WP site URL and API keys.
5. Run locally: `npm start`
6. Deploy: Use Vercel/Netlify for frontend; host WP on a server.

## Usage
- Browse homepage for collections.
- Add to cart/wishlist.
- Login to checkout (COD).
- View orders in dashboard and download files.

## Challenges & Solutions
- **API Integration**: Handled async fetches in useEffect (e.g., categories in FeaturedCollections.jsx). Filtered 'uncategorized' to focus on photography.
- **State Persistence**: Used localStorage for cart/wishlist to survive refreshes.
- **Auth Flow**: Implemented JWT storage and protected routes in App.jsx.
- **Virtual Downloads**: Ensured order API returns download links post-checkout.

## Future Improvements
- Add real payment gateways (e.g., Stripe).
- Server-side cart sync for multi-device.
- Enhance design (e.g., more responsive images).
- Tests with Jest.

Built by Stefan Grobler for learning purposes.