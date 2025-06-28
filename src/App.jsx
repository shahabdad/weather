import { useState } from 'react';
import axios from "axios";
import WeatherInput from './Input';
import WeatherDisplay from './Display';
import ErrorMessage from './ErrorMessage';
import './App.css';

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "455516afcb74211dc5a731f47e1330fb"; 

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError("");
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  return (
    <div className="weather-container">
      <h1>🌤️ Weather Web App</h1>
      <WeatherInput city={city} setCity={setCity} getWeather={getWeather} handleKeyPress={handleKeyPress} />
      {error && <ErrorMessage error={error} />}
      {weather && <WeatherDisplay weather={weather} />}
    </div>
  );
}

export default App;
