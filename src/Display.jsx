import React from 'react';
import './Display.css';
import WeatherCharts from './WeatherCharts';
import WeatherMap from './WeatherMap';

import {
  Droplets,
  Wind,
  Sun,
  Sprout,
  Eye,
  Moon,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Custom component to render animated weather icons with HTML+CSS keyframes
const AnimatedWeatherIcon = ({ iconName }) => {
  if (!iconName) return null;
  const icon = iconName.toLowerCase();

  if (icon.includes('snow')) {
    return (
      <div className="anim-icon snow">
        <div className="cloud-base"></div>
        <div className="snowflake sf-1">❄</div>
        <div className="snowflake sf-2">❄</div>
        <div className="snowflake sf-3">❄</div>
      </div>
    );
  }
  if (icon.includes('thunder') || icon.includes('storm')) {
    return (
      <div className="anim-icon thunder">
        <div className="cloud-base dark"></div>
        <div className="lightning-bolt">⚡</div>
      </div>
    );
  }
  if (icon.includes('rain') || icon.includes('showers')) {
    return (
      <div className="anim-icon rain">
        <div className="cloud-base"></div>
        <div className="rain-drop rd-1"></div>
        <div className="rain-drop rd-2"></div>
        <div className="rain-drop rd-3"></div>
      </div>
    );
  }
  if (icon.includes('night') || icon.includes('moon')) {
    return (
      <div className="anim-icon night">
        <div className="moon-crescent"></div>
        <div className="star s-1">★</div>
        <div className="star s-2">★</div>
      </div>
    );
  }
  if (icon.includes('clear-day') || icon.includes('sun') || icon.includes('sunny')) {
    return (
      <div className="anim-icon sunny">
        <div className="sun-core"></div>
        <div className="sun-rays-ring"></div>
      </div>
    );
  }
  if (icon.includes('cloud') || icon.includes('overcast')) {
    return (
      <div className="anim-icon cloudy">
        <div className="cloud-back"></div>
        <div className="cloud-front"></div>
      </div>
    );
  }
  if (icon.includes('fog') || icon.includes('mist') || icon.includes('haze')) {
    return (
      <div className="anim-icon mist">
        <div className="mist-line ml-1"></div>
        <div className="mist-line ml-2"></div>
        <div className="mist-line ml-3"></div>
      </div>
    );
  }
  return (
    <div className="anim-icon cloudy">
      <div className="cloud-back"></div>
      <div className="cloud-front"></div>
    </div>
  );
};

// Shimmering Skeleton placeholders for smooth transitions
const WeatherSkeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-card skeleton-hero"></div>
      <div className="skeleton-card skeleton-ai"></div>
      <div className="skeleton-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-card skeleton-stat"></div>
        ))}
      </div>
      <div className="skeleton-card skeleton-charts"></div>
      <div className="skeleton-card skeleton-timeline"></div>
    </div>
  );
};

const WeatherDisplay = ({ weather, unit, loading }) => {
  if (loading) return <WeatherSkeleton />;
  if (!weather) return null;

  const { resolvedAddress, currentConditions, days, alerts = [] } = weather;
  const todayForecast = days[0] || {};
  const hourlyHours = todayForecast.hours || [];
  const weeklyDays = days.slice(0, 10); // Expanded 10-day forecast

  // Formatting helpers
  const formatTemp = (tempVal) => {
    if (tempVal === undefined || tempVal === null) return '--';
    const rounded = unit === 'metric' ? Math.round(tempVal) : Math.round((tempVal * 9) / 5 + 32);
    return `${rounded}°${unit === 'metric' ? 'C' : 'F'}`;
  };

  const formatTime12h = (timeStr) => {
    if (!timeStr) return 'N/A';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const getWindDirection = (deg) => {
    if (deg === undefined || deg === null) return 'N/A';
    const val = Math.floor((deg / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  };

  const getMoonPhaseLabel = (fraction) => {
    if (fraction === undefined || fraction === null) return 'New Moon';
    if (fraction === 0 || fraction === 1) return 'New Moon';
    if (fraction === 0.25) return 'First Quarter';
    if (fraction === 0.5) return 'Full Moon';
    if (fraction === 0.75) return 'Last Quarter';
    if (fraction > 0 && fraction < 0.25) return 'Waxing Crescent';
    if (fraction > 0.25 && fraction < 0.5) return 'Waxing Gibbous';
    if (fraction > 0.5 && fraction < 0.75) return 'Waning Gibbous';
    return 'Waning Crescent';
  };

  // Generate dynamic metrics
  const humidity = currentConditions.humidity || 50;
  const humidityStatus = humidity < 35 ? 'Dry' : humidity > 65 ? 'Humid' : 'Good';

  const windSpeed = currentConditions.windspeed || 0;
  const windDirText = getWindDirection(currentConditions.winddir);

  const uv = currentConditions.uvindex || 0;
  const uvStatus = uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : 'Extreme';

  const simulatedAQI = Math.min(Math.max(Math.round(25 + (humidity / 4) - (windSpeed / 3) + (currentConditions.temp / 3)), 15), 180);
  const aqiStatus = simulatedAQI <= 50 ? 'Good' : simulatedAQI <= 100 ? 'Moderate' : 'Unhealthy';

  const simulatedPollen = currentConditions.temp > 15 && currentConditions.precip === 0 ? 'Moderate' : 'Low';

  // Dynamic Outdoor Scores
  const isRainy = currentConditions.icon && (currentConditions.icon.includes('rain') || currentConditions.icon.includes('showers'));
  const isStormy = currentConditions.icon && (currentConditions.icon.includes('thunder') || currentConditions.icon.includes('storm'));

  let runningScore = 90;
  let cyclingScore = 88;
  let travelScore = 95;

  if (currentConditions.temp > 30) {
    runningScore -= 45;
    cyclingScore -= 35;
    travelScore -= 20;
  }
  if (isRainy) {
    runningScore -= 60;
    cyclingScore -= 65;
    travelScore -= 50;
  }
  if (isStormy) {
    runningScore -= 80;
    cyclingScore -= 85;
    travelScore -= 70;
  }

  const running = Math.max(runningScore, 10);
  const cycling = Math.max(cyclingScore, 12);
  const travel = Math.max(travelScore, 15);

  // Clothing & Health Tips
  let clothing = ['👕 Light Shirt', '👟 Sneakers', '🕶️ Sunglasses'];
  let healthTip = '💧 Stay hydrated throughout the day.';
  let aiSummary = `Today's forecast calls for ${currentConditions.conditions ? currentConditions.conditions.toLowerCase() : 'clear sky'} in ${resolvedAddress.split(',')[0]}.`;

  if (currentConditions.temp > 30) {
    clothing = ['👕 Light Tee', '🕶️ Sunglasses', '🧴 Sunscreen'];
    healthTip = '🌞 High heat index. Avoid sunlight after 2 PM.';
    aiSummary += " High temperatures expected. Great for indoor activities or swimming, but keep sunscreen ready!";
  } else if (currentConditions.temp < 15) {
    clothing = ['🧥 Warm Jacket', '🧣 Soft Scarf', '👟 Sneakers'];
    healthTip = '🍵 Drink warm beverages and stay insulated.';
    aiSummary += " Cooler temperatures today. Bundling up with a light jacket is highly recommended.";
  }
  if (isRainy) {
    clothing = ['🧥 Raincoat', '☂️ Umbrella', '🥾 Waterproof Boots'];
    healthTip = '☔ Carry an umbrella. Expect wet pathways.';
    aiSummary += " Rain expected. Don't forget your umbrella, and keep outdoor commutes short.";
  }

  // Calculate Sunrise / Sunset positioning along visual arc path
  const currentEpoch = currentConditions.datetimeEpoch;
  const sunriseEpoch = todayForecast.sunriseEpoch;
  const sunsetEpoch = todayForecast.sunsetEpoch;

  const totalDaylight = sunsetEpoch - sunriseEpoch;
  const elapsed = currentEpoch - sunriseEpoch;
  const solarProgress = Math.max(0, Math.min(1, elapsed / totalDaylight));

  // Circular arc calculation (Center 60,70 R=50 from theta=PI to theta=0)
  const theta = Math.PI - solarProgress * Math.PI;
  const sunX = 60 + 50 * Math.cos(theta);
  const sunY = 70 - 50 * Math.sin(theta);
  const isDaytime = currentEpoch >= sunriseEpoch && currentEpoch <= sunsetEpoch;

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 90, damping: 14 } 
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      className="weather-display-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Weather Alerts Warning Panel */}
      {alerts.length > 0 && (
        <motion.div 
          className="weather-alerts-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className="alerts-title-row">
            <AlertTriangle className="alert-banner-icon blinking" />
            <h3 className="alerts-title">Active Weather Warnings ({alerts.length})</h3>
          </div>
          <div className="alerts-list">
            {alerts.map((alert, idx) => (
              <div key={idx} className="alert-item">
                <span className="alert-event">{alert.event}</span>
                <p className="alert-description">{alert.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="dashboard-grid-layout">
        <div className="dashboard-column">
          {/* 1. Main Hero Panel */}
          <motion.div className="weather-hero" variants={cardVariants}>
            <div className="hero-main-info">
              <h2 className="location-name">{resolvedAddress}</h2>
              <div className="temp-hero">
                <span className="temp-value">
                  {unit === 'metric' ? Math.round(currentConditions.temp) : Math.round((currentConditions.temp * 9) / 5 + 32)}
                </span>
                <span className="temp-unit">°{unit === 'metric' ? 'C' : 'F'}</span>
              </div>
              <p className="weather-desc">{currentConditions.conditions}</p>
            </div>
            <div className="hero-icon-container">
              <AnimatedWeatherIcon iconName={currentConditions.icon || ''} />
            </div>
          </motion.div>

          {/* 2. AI Weather Summary */}
          <motion.div className="ai-summary-card" variants={cardVariants}>
            <div className="ai-header">
              <Sparkles className="ai-logo-icon" />
              <h3 className="ai-title">AI Forecast Summary</h3>
            </div>
            <p className="ai-desc">{aiSummary}</p>
            <div className="outdoor-score-bar">
              <span className="score-label">Outdoor Suitability Score:</span>
              <span className="score-number">{Math.round((running + cycling + travel) / 3)}%</span>
            </div>
          </motion.div>

          {/* 3. Symmetrical 8-Card Detailed Grid */}
          <motion.div className="stats-grid" variants={gridVariants}>
            <motion.div className="stat-card" variants={statCardVariants}>
              <div className="stat-icon-wrapper temp">
                <Droplets className="stat-icon" />
              </div>
              <div className="stat-details">
                <span className="stat-label">Humidity</span>
                <span className="stat-value">{Math.round(humidity)}%</span>
                <span className="stat-badge-desc">{humidityStatus}</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" variants={statCardVariants}>
              <div className="stat-icon-wrapper wind">
                <Wind className="stat-icon" />
              </div>
              <div className="stat-details">
                <span className="stat-label">Wind Speed</span>
                <span className="stat-value">{Math.round(windSpeed)} km/h</span>
                <span className="stat-badge-desc">{windDirText}</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" variants={statCardVariants}>
              <div className="stat-icon-wrapper range">
                <Sun className="stat-icon" />
              </div>
              <div className="stat-details">
                <span className="stat-label">UV Index</span>
                <span className="stat-value">{uv}</span>
                <span className="stat-badge-desc">{uvStatus}</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" variants={statCardVariants}>
              <div className="stat-icon-wrapper visibility">
                <Eye className="stat-icon" />
              </div>
              <div className="stat-details">
                <span className="stat-label">Air Quality</span>
                <span className="stat-value">{simulatedAQI} AQI</span>
                <span className="stat-badge-desc">{aqiStatus}</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" variants={statCardVariants}>
              <div className="stat-icon-wrapper pressure">
                <Sprout className="stat-icon" />
              </div>
              <div className="stat-details">
                <span className="stat-label">Pollen levels</span>
                <span className="stat-value">{simulatedPollen}</span>
                <span className="stat-badge-desc">Grass & Tree</span>
              </div>
            </motion.div>

            <motion.div className="stat-card" variants={statCardVariants}>
              <div className="stat-icon-wrapper sunset">
                <Moon className="stat-icon" />
              </div>
              <div className="stat-details">
                <span className="stat-label">Moon Phase</span>
                <span className="stat-value" style={{ fontSize: '0.8rem' }}>{getMoonPhaseLabel(currentConditions.moonphase)}</span>
                <span className="stat-badge-desc">Cycle State</span>
              </div>
            </motion.div>

            {/* Sunrise/Sunset Solar arc card */}
            <motion.div className="stat-card solar-arc-card" variants={statCardVariants}>
              <span className="stat-label">Solar Timeline</span>

              <div className="solar-svg-wrapper">
                <svg viewBox="0 0 120 80" width="100%" height="60px">
                  <path
                    d="M 10 70 A 50 50 0 0 1 110 70"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="2"
                    strokeDasharray="2,2"
                  />
                  <line x1="5" y1="70" x2="115" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

                  <text x="10" y="78" textAnchor="middle" fontSize="6.5" fill="var(--text-secondary)">
                    {formatTime12h(currentConditions.sunrise).split(' ')[0]}
                  </text>
                  <text x="110" y="78" textAnchor="middle" fontSize="6.5" fill="var(--text-secondary)">
                    {formatTime12h(currentConditions.sunset).split(' ')[0]}
                  </text>

                  {isDaytime ? (
                    <circle
                      cx={sunX}
                      cy={sunY}
                      r="5.5"
                      fill="#ff9800"
                      stroke="#ffffff"
                      strokeWidth="1"
                      className="sun-marker-glow"
                    />
                  ) : (
                    <circle
                      cx="60"
                      cy="70"
                      r="4.5"
                      fill="none"
                      stroke="var(--primary-color)"
                      strokeWidth="1.5"
                    />
                  )}
                </svg>
              </div>

              <span className="solar-time-status">
                {isDaytime ? `Sunset in ${formatTime12h(currentConditions.sunset)}` : 'Solar Night'}
              </span>
            </motion.div>

            {/* Ambient Temperature range card */}
            <motion.div className="stat-card" variants={statCardVariants}>
              <div className="stat-icon-wrapper sunrise">
                <Sun className="stat-icon" strokeWidth={1.5} />
              </div>
              <div className="stat-details">
                <span className="stat-label">Min / Max</span>
                <span className="stat-value">{formatTemp(todayForecast.tempmin)} / {formatTemp(todayForecast.tempmax)}</span>
                <span className="stat-badge-desc">Daily Extremes</span>
              </div>
            </motion.div>
          </motion.div>

          {/* 4. Recommendation lists */}
          <motion.div className="tips-split-layout" variants={cardVariants}>
            <div className="tip-box">
              <h4>Clothing Advice</h4>
              <div className="tip-pills">
                {clothing.map((c, i) => (
                  <span key={i} className="clothing-tag">{c}</span>
                ))}
              </div>
            </div>
            <div className="tip-box">
              <h4>Outdoor Score</h4>
              <div className="score-breakdowns">
                <div className="score-row">
                  <span>Running</span>
                  <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: `${running}%` }}></div></div>
                  <span>{running}%</span>
                </div>
                <div className="score-row">
                  <span>Cycling</span>
                  <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: `${cycling}%` }}></div></div>
                  <span>{cycling}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="dashboard-column">
          {/* 5. Spline charts */}
          <WeatherCharts hours={hourlyHours} unit={unit} />

          {/* 6. Hourly Scrollable Forecast */}
          <motion.div className="hourly-forecast-card" variants={cardVariants}>
            <h3 className="section-card-title">Hourly Timeline</h3>
            <div className="hourly-scroll-container">
              {hourlyHours.slice(0, 12).map((hr, idx) => {
                const tempVal = hr.temp;
                return (
                  <div key={idx} className="hour-card">
                    <span className="hour-time">{hr.datetime.split(':').slice(0, 2).join(':')}</span>
                    <div className="hour-icon-mini">
                      <div className="icon-mini-circle">
                        {hr.icon.includes('rain') ? '🌧' : hr.icon.includes('clear') ? '☀️' : '☁️'}
                      </div>
                    </div>
                    <span className="hour-temp">{formatTemp(tempVal)}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* 7. Weekly Forecast List: Symmetrical 10-day Forecast */}
          <motion.div className="weekly-forecast-card" variants={cardVariants}>
            <h3 className="section-card-title">10-Day Forecast Outlook</h3>
            <div className="weekly-list">
              {weeklyDays.map((day, idx) => (
                <div key={idx} className="weekly-row">
                  <span className="weekly-date">
                    {new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <div className="weekly-condition">
                    <span className="weekly-emoji">
                      {day.icon.includes('rain') ? '🌧' : day.icon.includes('clear') ? '☀️' : '☁️'}
                    </span>
                    <span className="weekly-desc-text">{day.conditions}</span>
                  </div>
                  <span className="weekly-range">
                    {formatTemp(day.tempmin)} / {formatTemp(day.tempmax)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 8. Canvas Radar Simulator */}
          <WeatherMap cityName={resolvedAddress.split(',')[0]} />
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>Dashboard compiled via Visual Crossing Timeline API</p>
        <p>© 2026 Skyline Weather System</p>
      </footer>
    </motion.div>
  );
};

export default WeatherDisplay;
