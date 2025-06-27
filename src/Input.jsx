import React from 'react';
const WeatherInput = ({ city, setCity, getWeather, handleKeyPress }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={getWeather}>Get Weather</button>
    </div>
  );
};
export default WeatherInput;