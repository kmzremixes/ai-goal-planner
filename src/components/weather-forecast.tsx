"use client";

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSun, Moon, CloudMoon, CloudSnow, CloudLightning, SunDim } from 'lucide-react';

interface WeatherData {
  time: string;
  temp: number;
  icon: React.ReactNode;
}

const WeatherForecast = () => {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [locationName, setLocationName] = useState('Borabue, Maha Sarakham');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Coordinates for Borabue, Maha Sarakham
  const BORABUE_LAT = 15.96;
  const BORABUE_LON = 103.25;

  // WMO Weather interpretation codes
  const getWeatherIcon = (code: number, isDay: number): React.ReactNode => {
    switch (code) {
      case 0: return isDay ? <Sun /> : <Moon />; // Clear sky
      case 1: return isDay ? <SunDim /> : <CloudMoon />; // Mainly clear
      case 2: return isDay ? <CloudSun /> : <CloudMoon />; // Partly cloudy
      case 3: return <Cloud />; // Overcast
      case 45: case 48: return <Cloud />; // Fog
      case 51: case 53: case 55: return <CloudRain />; // Drizzle
      case 61: case 63: case 65: return <CloudRain />; // Rain
      case 66: case 67: return <CloudRain />; // Freezing Rain
      case 71: case 73: case 75: return <CloudSnow />; // Snow fall
      case 80: case 81: case 82: return <CloudRain />; // Rain showers
      case 85: case 86: return <CloudSnow />; // Snow showers
      case 95: case 96: case 99: return <CloudLightning />; // Thunderstorm
      default: return isDay ? <Sun /> : <Moon />;
    }
  };

  const fetchWeather = (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,weather_code&timezone=auto`;

    fetch(weatherUrl)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch weather data.');
        }
        const weatherData = await res.json();
        
        const now = new Date();
        const currentHour = now.getHours();

        // Find the index for the current hour in the hourly data
        const startIndex = weatherData.hourly.time.findIndex((t: string) => new Date(t).getHours() === currentHour);
        if (startIndex === -1) {
            setForecast([]);
            return;
        }
        
        const isDay = weatherData.current.is_day;

        // Current weather
        const current: WeatherData = {
          time: 'Now',
          temp: Math.round(weatherData.current.temperature_2m),
          icon: getWeatherIcon(weatherData.current.weather_code, isDay)
        };
        
        // Create forecast for the next 7 hours from the current hour
        const hourlyForecast = weatherData.hourly.time
          .slice(startIndex + 1, startIndex + 8)
          .map((time: string, index: number) => {
            const hourIndex = startIndex + 1 + index;
            const hourDate = new Date(time);
            return {
              time: hourDate.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }),
              temp: Math.round(weatherData.hourly.temperature_2m[hourIndex]),
              icon: getWeatherIcon(weatherData.hourly.weather_code[hourIndex], isDay)
            };
          });

        setForecast([current, ...hourlyForecast]);
      })
      .catch(err => {
        console.error("Weather fetch error:", err);
        setError("Could not retrieve weather data.");
      })
      .finally(() => setIsLoading(false));
  };
  
  useEffect(() => {
    const fetchAndSetInterval = () => {
        fetchWeather(BORABUE_LAT, BORABUE_LON);
    };
    
    fetchAndSetInterval(); // Initial fetch
    
    const intervalId = setInterval(fetchAndSetInterval, 30 * 60 * 1000); // Refresh every 30 minutes

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <div className="cyber-card no-print">
      <h3 className="cyber-title text-2xl mb-2">WEATHER FORECAST</h3>
      <p className="text-pink-300 text-sm mb-6">{locationName}</p>
      
      {isLoading && <div className="flex items-center justify-center h-36"><div className="spinner"></div><span className="ml-4">Loading forecast...</span></div>}
      {error && <div className="text-red-400 text-center h-36 flex items-center justify-center">{error}</div>}
      
      {!isLoading && !error && (
        <div className="flex overflow-x-auto space-x-4 pb-4">
            {forecast.map((hour, index) => (
            <div key={index} className="flex-shrink-0 w-28 text-center p-4 bg-black/40 rounded-xl border border-pink-500/50">
                <p className="font-bold text-lg">{hour.time}</p>
                <div className="text-4xl my-2 text-cyan-300 flex justify-center items-center h-12">{hour.icon}</div>
                <p className="text-2xl font-bold">{hour.temp}°C</p>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
