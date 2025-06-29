import { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherInput from './Input';
import WeatherDisplay from './Display';
import ErrorMessage from './ErrorMessage';
import { FaCloudSun } from 'react-icons/fa';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const apiKey = '455516afcb74211dc5a731f47e1330fb';

  const getWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setCity(response.data.name);
      setError('');
    } catch (err) {
      setError('Failed to get weather by location.');
      setWeather(null);
    }
  };


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        () => setError('Location permission denied.'),
        { timeout: 10000 }
      );
    } else {
      setError('Geolocation not supported.');
    }
  }, []);

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('City not found.');
      setWeather(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') getWeather();
  };

  return (
    <>
    <div className="weather-container mt-5 fade-in">
      <h1 className="title">
        <FaCloudSun className="logo-icon  " /> Weather Web App
      </h1>

      <WeatherInput
      className=""
        city={city}
        setCity={setCity}
        getWeather={getWeather}
        handleKeyPress={handleKeyPress}
      />

      {error && <ErrorMessage error={error} />}
      {weather && <WeatherDisplay weather={weather} />}
    </div>
    </>
  );
}

export default App;
