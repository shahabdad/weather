import { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherInput from './Input';
import WeatherDisplay from './Display';
import ErrorMessage from './ErrorMessage';
import { CloudSun, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('metric'); // 'metric' (°C) or 'imperial' (°F)
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [recentSearches, setRecentSearches] = useState([]);

  const apiKey = 'N6AQMSBQWDAKUVQ9YNZ3976YZ';
  const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

  // Load recent searches from localStorage
  useEffect(() => {
    const savedRecents = localStorage.getItem('skyline_recents');
    if (savedRecents) {
      try {
        setRecentSearches(JSON.parse(savedRecents));
      } catch (err) {
        console.error("Failed to parse recent searches", err);
      }
    }
  }, []);

  const updateRecentSearches = (cityName) => {
    if (!cityName) return;
    // Capitalize first letter of city name
    const cleanName = cityName.trim();
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== formattedName.toLowerCase());
      const updated = [formattedName, ...filtered].slice(0, 5);
      localStorage.setItem('skyline_recents', JSON.stringify(updated));
      return updated;
    });
  };

  const getWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${baseUrl}/${lat},${lon}?unitGroup=metric&key=${apiKey}&contentType=json`
      );
      setWeather(response.data);
      const addressName = response.data.resolvedAddress.split(',')[0];
      setCity(addressName);
    } catch (err) {
      setError('Failed to fetch weather for your location coordinates.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocationWeather = () => {
    setLoading(true);
    setError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        () => {
          setError('Location access denied. Please type a city name.');
          setLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      setError('Geolocation not supported by this browser.');
      setLoading(false);
    }
  };

  const getWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${baseUrl}/${encodeURIComponent(city.trim())}?unitGroup=metric&key=${apiKey}&contentType=json`
      );
      setWeather(response.data);
      updateRecentSearches(city);
    } catch (err) {
      setError('City not found. Please try another search.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = async (cityName) => {
    setCity(cityName);
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${baseUrl}/${encodeURIComponent(cityName)}?unitGroup=metric&key=${apiKey}&contentType=json`
      );
      setWeather(response.data);
      updateRecentSearches(cityName);
    } catch (err) {
      setError(`Failed to fetch weather for ${cityName}.`);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch via GPS
    handleGetLocationWeather();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') getWeather();
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Modern weather conditions-to-theme-palette mapping
  const getThemeClass = () => {
    if (!weather || !weather.currentConditions) return 'theme-default';
    const icon = weather.currentConditions.icon.toLowerCase();
    const cond = weather.currentConditions.conditions.toLowerCase();
    
    if (icon.includes('snow')) return 'theme-snow';
    if (icon.includes('thunder') || cond.includes('thunder') || cond.includes('lightning') || cond.includes('storm')) return 'theme-thunder';
    if (icon.includes('rain') || icon.includes('showers') || cond.includes('rain') || cond.includes('drizzle')) return 'theme-rain';
    if (icon.includes('clear-night') || icon.includes('night')) return 'theme-night';
    if (icon.includes('clear-day') || icon.includes('sun') || cond.includes('sunny') || cond.includes('clear')) return 'theme-sunny';
    if (icon.includes('cloud') || cond.includes('cloudy') || cond.includes('overcast') || icon.includes('fog') || icon.includes('wind')) return 'theme-cloudy';
    return 'theme-default';
  };

  return (
    <div className={`app-viewport ${getThemeClass()} ${theme === 'light' ? 'light-mode' : ''}`}>
      <motion.div 
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <header className="app-header">
          <div className="header-title-section">
            <CloudSun className="logo-icon" />
            <h1 className="title">Skyline Weather</h1>
          </div>

          <div className="settings-controls-group">
            <motion.button 
              className="theme-mode-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              type="button"
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'dark' ? <Sun className="mode-toggle-icon" /> : <Moon className="mode-toggle-icon" />}
            </motion.button>

            <div className="unit-toggle-container">
              <motion.button 
                className={`unit-toggle-btn ${unit === 'metric' ? 'active' : ''}`}
                onClick={() => setUnit('metric')}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                °C
              </motion.button>
              <motion.button 
                className={`unit-toggle-btn ${unit === 'imperial' ? 'active' : ''}`}
                onClick={() => setUnit('imperial')}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                °F
              </motion.button>
            </div>
          </div>
        </header>

        <WeatherInput
          city={city}
          setCity={setCity}
          getWeather={getWeather}
          handleKeyPress={handleKeyPress}
          loading={loading}
          onGetLocation={handleGetLocationWeather}
          onQuickSearch={handleQuickSearch}
          recentSearches={recentSearches}
        />

        {/* If loading, render skeleton loading states in Display instead of spinner */}
        {loading && <WeatherDisplay loading={true} />}
        {!loading && error && <ErrorMessage error={error} />}
        {!loading && weather && <WeatherDisplay weather={weather} unit={unit} loading={false} />}
      </motion.div>
    </div>
  );
}

export default App;
