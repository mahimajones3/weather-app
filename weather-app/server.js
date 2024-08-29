const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Replace with your Weatherstack API key
const API_KEY = 'ec063b41f3e7dbe377ddd80c52a17acf';

// Middleware to parse JSON
app.use(express.json());

// Route to fetch weather data for a given city
app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const response = await fetch(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`);
        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.info });
        }

        const weatherData = data.current;
        const locationData = data.location;

        res.json({
            location: `${locationData.name}, ${locationData.country}`,
            temperature: weatherData.temperature,
            weather_descriptions: weatherData.weather_descriptions,
            wind_speed: weatherData.wind_speed,
            humidity: weatherData.humidity,
            time: locationData.localtime
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
