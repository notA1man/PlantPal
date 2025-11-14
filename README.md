# PlantPal

A smart plant care companion web application that helps you manage and care for your plants with AI-powered features.

## About

PlantPal is a full-stack web application that gamifies plant care management with a pixelated theme. Track your plants, get AI-powered health diagnoses, receive personalized care suggestions, and chat with an AI assistant about your plants.

## Features

- 🌿 **Plant Management** - Add, track, and manage your plant collection
- 💧 **Water & Fertilizer Tracking** - Keep track of when you last watered or fertilized your plants
- 🤖 **AI Plant Doctor** - Upload images to get instant plant health diagnoses using Gemini AI
- 💬 **AI Chat Assistant** - Ask questions about your plants and get personalized advice
- 💡 **AI Care Suggestions** - Get context-aware care tips based on your plant's information
- 🌤️ **Weather Insights** - Get weather-based care suggestions for your location

## How to Run

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or connection string)
- API Keys:
  - Google Gemini API key
  - OpenWeatherMap API key

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/plantpal
JWT_SECRET=your_random_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
WEATHER_API_KEY=your_openweathermap_api_key_here
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- React Icons

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs

### External APIs
- Google Gemini API
- OpenWeatherMap API

---

Built with ❤️

