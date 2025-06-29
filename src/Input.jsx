import React from 'react';
import { FaSearchLocation } from 'react-icons/fa';

const WeatherInput = ({ city, setCity, getWeather, handleKeyPress }) => {
  return (
    <>
      <div className="input-container">
        <div className="input-wrapper">
          <FaSearchLocation className="location-icon" />
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button className="weather-button" onClick={getWeather}>
          Get Weather
        </button>
      </div>

      {/* Internal CSS Styling */}
      <style jsx="true">{`
        .input-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 30px;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          background: #f1f1f1;
          padding: 10px 15px;
          border-radius: 50px;
          width: 280px;
          margin-bottom: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .input-wrapper input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 16px;
          padding-left: 10px;
          outline: none;
        }

        .location-icon {
          color: #3498db;
          font-size: 20px;
          animation: pulse 2s infinite;
        }

        .weather-button {
          background-color: #3498db;
          color: white;
          padding: 10px 25px;
          font-size: 16px;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .weather-button:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default WeatherInput;

