// // import React from 'react';
// // const WeatherDisplay = ({ weather }) => {
// //   return (
// //     <div className="weather-info">
// //       <h2>{weather.name}, {weather.sys.country}</h2>
// //       <img
// //         src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
// //         alt="weather icon"
// //         className="weather-icon"
// //       />
// //       <p>{weather.weather[0].description}</p>
// //       <p>🌡️ Temp: {weather.main.temp}°C</p>
// //       <p>💧 Humidity: {weather.main.humidity}%</p>
// //       <p>🌬️ Wind: {weather.wind.speed} m/s</p>
// //     </div>
// //   );
// // };
// // export default WeatherDisplay;


// import React from 'react';
// import './Display.css';

// const WeatherDisplay = ({ weather }) => {
//   if (!weather) return null;

//   const { name, sys, main, weather: weatherData, wind } = weather;
//   const { icon, description } = weatherData[0];

//   return (
//     <div className="weather-card">
//       <h2 className="location">{name}, {sys.country}</h2>
//       <div className="weather-details">
//         <img
//           className="weather-icon"
//           src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
//           alt={description}
//         />
//         <div className="weather-stats">
//           <p className="description">{description.toUpperCase()}</p>
//           <p><strong>🌡️ Temperature:</strong> {main.temp}°C</p>
//           <p><strong>💧 Humidity:</strong> {main.humidity}%</p>
//           <p><strong>🌬️ Wind:</strong> {wind.speed} m/s</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeatherDisplay;



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
