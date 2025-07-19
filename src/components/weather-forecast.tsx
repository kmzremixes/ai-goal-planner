"use client";

const WeatherForecast = () => {
  const mockData = [
    { time: '01:00', temp: 26, icon: '🌙' },
    { time: '04:00', temp: 25, icon: '☁️' },
    { time: '07:00', temp: 27, icon: '☀️' },
    { time: '10:00', temp: 31, icon: '🌤️' },
    { time: '13:00', temp: 34, icon: '🌦️' },
    { time: '16:00', temp: 32, icon: '🌥️' },
    { time: '19:00', temp: 29, icon: '☁️' },
    { time: '22:00', temp: 28, icon: '🌙' }
  ];

  return (
    <div className="cyber-card no-print">
      <h3 className="cyber-title text-2xl mb-6">WEATHER FORECAST (EXAMPLE)</h3>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {mockData.map((hour, index) => (
          <div key={index} className="flex-shrink-0 w-28 text-center p-4 bg-black/40 rounded-xl border border-pink-500/50">
            <p className="font-bold text-lg">{hour.time}</p>
            <p className="text-4xl my-2">{hour.icon}</p>
            <p className="text-2xl font-bold">{hour.temp}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
