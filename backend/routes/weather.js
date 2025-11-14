import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/insights', auth, async (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude required' });
  }

  const apiKey = process.env.WEATHER_API_KEY || '';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.cod !== 200) {
    return res.status(400).json({ message: 'Weather data unavailable' });
  }

  const insights = {
    temp: data.main.temp,
    humidity: data.main.humidity,
    condition: data.weather[0].main,
    suggestion: generateSuggestion(data.main.humidity, data.main.temp)
  };

  res.json(insights);
});

function generateSuggestion(humidity, temp) {
  if (humidity < 40) return "Low humidity - your ferns might need misting";
  if (humidity > 70) return "High humidity - reduce watering frequency";
  if (temp > 30) return "Hot weather - provide shade for sensitive plants";
  if (temp < 10) return "Cold weather - move sensitive plants indoors";
  return "Weather conditions are favorable for most plants";
}

export default router;

