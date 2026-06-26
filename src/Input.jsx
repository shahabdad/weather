import React from 'react';
import { Search, Locate, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const FAVORITE_CITIES = ['Islamabad', 'Lahore', 'Karachi', 'Mardan', 'London', 'Dubai'];

const WeatherInput = ({ 
  city, 
  setCity, 
  getWeather, 
  handleKeyPress, 
  loading, 
  onGetLocation, 
  onQuickSearch,
  recentSearches = []
}) => {

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.start();
    
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      let cleanQuery = spokenText.trim().toLowerCase();
      // Remove voice filler like "weather in..."
      if (cleanQuery.startsWith('weather in ')) {
        cleanQuery = cleanQuery.substring(11);
      } else if (cleanQuery.startsWith('weather ')) {
        cleanQuery = cleanQuery.substring(8);
      }
      if (cleanQuery) {
        setCity(cleanQuery);
        onQuickSearch(cleanQuery);
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e);
    };
  };

  return (
    <motion.div 
      className="search-container-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="search-section">
        <div className="search-bar-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <motion.button
            type="button"
            className="voice-search-btn"
            onClick={handleVoiceSearch}
            title="Search with voice"
            disabled={loading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Mic className="voice-mic-icon" />
          </motion.button>
          <motion.button
            className="location-trigger-btn"
            onClick={onGetLocation}
            title="Use current location"
            disabled={loading}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Locate className={loading ? "gps-icon loading" : "gps-icon"} />
          </motion.button>
        </div>
        <motion.button 
          className="search-submit-btn" 
          onClick={getWeather} 
          disabled={loading || !city.trim()}
          whileHover={loading || !city.trim() ? {} : { scale: 1.02 }}
          whileTap={loading || !city.trim() ? {} : { scale: 0.98 }}
        >
          Search
        </motion.button>
      </div>

      <div className="quick-lists-container">
        <div className="city-list-row">
          <span className="list-row-label">Favorites:</span>
          <div className="pills-grid">
            {FAVORITE_CITIES.map((name) => (
              <motion.button
                key={name}
                type="button"
                className="city-pill"
                onClick={() => onQuickSearch(name)}
                disabled={loading}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                {name}
              </motion.button>
            ))}
          </div>
        </div>

        {recentSearches.length > 0 && (
          <div className="city-list-row mt-2">
            <span className="list-row-label">Recents:</span>
            <div className="pills-grid">
              {recentSearches.map((name, idx) => (
                <motion.button
                  key={`${name}-${idx}`}
                  type="button"
                  className="city-pill recent-pill"
                  onClick={() => onQuickSearch(name)}
                  disabled={loading}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {name}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherInput;
