<h1 align="center">🚗 Carpooling System</h1>

<p align="center">
  <strong>A smart, efficient, and secure ride-sharing platform connecting drivers and riders seamlessly.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
</p>

---

## 🌟 Overview

The **Carpooling System** is a full-stack web application designed to make daily commutes easier, cheaper, and more eco-friendly. Users can offer rides to others or search and book available rides. It features a complete authentication system, secure payment integration using Razorpay, and a modern, responsive frontend.

## ✨ Features

- 🔐 **User Authentication**: Secure registration and login using JWT.
- 🔍 **Ride Discovery**: Search for rides based on origin, destination, date, and available seats.
- 🚘 **Offer a Ride**: Drivers can list their upcoming trips and set the available seats and price.
- 📅 **Manage Bookings**: Seamless ride booking and cancellation functionality.
- 💳 **Secure Payments**: Razorpay integrated payment pipeline.
- 📱 **Interactive UI**: Clean, responsive, and modern React interface powered by Lucide icons.

## 🛠️ Tech Stack

### Frontend
- **React.js** (v19) - UI Library
- **React Router** - Navigation
- **Axios** - API Client
- **Lucide React** - Iconography

### Backend
- **Node.js & Express.js** - Server & API Framework
- **MongoDB & Mongoose** - Database & Object Data Modeling
- **JSON Web Tokens (JWT)** - Authentication
- **Bcrypt.js** - Password Hashing
- **Razorpay** - Payment Gateway

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Razorpay Account (for testing payments)

### 1. Clone the repository

```bash
git clone https://github.com/preritasaini1/Carpooling-System.git
cd Carpooling-System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/carpooling
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal window:
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm start
```

The application will be running at [http://localhost:3000](http://localhost:3000).

## 🗄️ Database Structure

- **Users**: Manages profiles and authentication data.
- **Rides**: Contains route, driver, price, and seat information.
- **Bookings**: Tracks passenger bookings on specific rides.
- **Payments**: Payment tracking linked to bookings.

## 🔌 API Integration

The frontend connects to the backend through a comprehensive API service configured with Axios. It features:
- Automatic JWT injection in requests.
- Automatic routing for `401 Unauthorized` responses.
- Clear separation of concerns (Auth, Rides, Bookings, Payments).

For complete details on the frontend-backend integration, refer to the [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md).

## 📄 License

This project is licensed under the ISC License.
