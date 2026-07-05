# SunMiniURL

SunMiniURL is a fast, free, and incredibly simple URL shortener built with React, TypeScript, and Vite. It allows you to transform long, complex URLs into clean, shareable links in seconds.

## ✨ Features

- **URL Shortening**: Easily convert long URLs into compact, manageable short links.
- **Custom Short Codes**: Create memorable custom short codes (e.g., `sunminiurl.vercel.app/my-custom-link`).
- **Instant Redirection**: Lightning-fast redirects when visiting a generated short URL.
- **URL Lookup**: Easily find the original destination of any short code or shortened URL using the built-in lookup tool.
- **Link History**: Automatically keeps a local history of your recently shortened URLs for easy access and copying.
- **Dark/Light Mode**: Beautiful UI built with Tailwind CSS, complete with a dark mode toggle.
- **Fast & Secure**: Powered by a robust API to ensure your links are generated quickly and are always accessible.

## 🛠️ How it Works (Under the Hood)

SunMiniURL operates as a Single Page Application (SPA) built with Vite and React. The redirection magic is handled completely on the frontend client side:

1. **Routing:** When a user visits a short link like `https://sunminiurl.vercel.app/develop`, Vercel naturally expects a file named `develop`. However, thanks to the `vercel.json` rewrite configuration, all requests fall back to `index.html`.
2. **Path Parsing:** Upon loading, the React app (`App.tsx`) extracts the path (`/develop`) from `window.location.pathname`.
3. **API Fetch:** A request is dispatched to the backend API (`https://sunminiurl.onrender.com/api/v1/shorten/develop`) to retrieve the associated `original_url`.
4. **Seamless Redirect:** While fetching, the user is presented with a sleek loading screen. Once the original URL is retrieved, the app instantly redirects the user via `window.location.href`. If the code doesn't exist, it gracefully routes them to the home page with an error notification.

## 🚀 How to Run the Project

This project uses **Node.js** and **npm** for package management.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd sunminiurl
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`.*

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## 💻 Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Icons:** Lucide React
- **Hosting:** Vercel

---
Powered by [MD. Shariar Hossain Sun](https://github.com/sun01822/)
