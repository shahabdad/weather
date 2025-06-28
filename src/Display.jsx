import React from 'react';
import './Display.css';
import { FaTemperatureHigh, FaTint, FaWind } from 'react-icons/fa';

const WeatherDisplay = ({ weather }) => {
  if (!weather) return null;

  const { name, sys, main, weather: weatherData, wind } = weather;
  const { icon, description } = weatherData[0];

  return (
    <div className="weather-container">
      <h2 className="location">{name}, {sys.country}</h2>
      <div className="main-weather">
        <img
          className="weather-icon bounce"
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={description}
        />
        <p className="description">{description.toUpperCase()}</p>
      </div>

      <div className="cards-container">
        <div className="weather-card slide-in">
          <FaTemperatureHigh className="icon" />
          <h3>Temperature</h3>
          <p>{main.temp}°C</p>
        </div>

        <div className="weather-card slide-in delay-1">
          <FaTint className="icon" />
          <h3>Humidity</h3>
          <p>{main.humidity}%</p>
        </div>

        <div className="weather-card slide-in delay-2">
          <FaWind className="icon" />
          <h3>Wind</h3>
          <p>{wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
