# 🎨 NextGen B2B E-Commerce - Frontend

Modern, responsive React application for the NextGen B2B E-Commerce & Catalog SaaS platform.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Building for Production](#building-for-production)

## ✨ Features

### Current Features
- ✅ **Authentication** - Login, Register, Forgot Password
- ✅ **Multi-Role Support** - Vendor, Customer, Staff, Super Admin
- ✅ **Product Management** - Create, edit, delete products with image uploads
- ✅ **Catalog Builder** - Create shareable catalog with multiple templates
- ✅ **Order Management** - View, track, and manage orders
- ✅ **Inventory Dashboard** - Real-time stock tracking
- ✅ **Customer Management** - CRM features for vendors
- ✅ **Analytics Dashboard** - Sales charts, KPIs, insights
- ✅ **Public Catalog Viewer** - Share catalogs via link/QR code
- ✅ **Settings** - Business profile, branding, payment configuration
- ✅ **Responsive Design** - Mobile-first approach

## 🛠 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router v7
- **State Management:** React Context + React Query
- **Styling:** TailwindCSS 4
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** React Icons
- **Notifications:** React Hot Toast

## 📦 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Backend API** running (see Backend README)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

## ⚙️ Environment Setup

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Razorpay (Client-side)
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Application will start on `http://localhost:5173`

### Preview Production Build
```bash
npm run build
npm run preview
```

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗 Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

---

**Built with ⚡ Vite + ⚛️ React + 🎨 TailwindCSS**
