Weather:
// Source: https://openweathermap.org/current
// States: Thunderstorm, Drizzle, Rain, Snow, Clear, Clouds
// Rest of the States: Mist, Smoke, Haze, Dust, Fog, Sand, Dust, Ash, Squall, Tornado

require('dotenv').config();

const apiKey = process.env.WEATHER_API_KEY;
const units = 'metric';
const fetch = require('node-fetch');

    
        async function WeatherApiCall (city) {
            let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error("Network response was not OK");
                
              }

            const weatherData = await response.json();
            return weatherData;
          }

          async function getAllWeatherData(req, res) {
            const city = req.params.city;
            try {
                const weatherData = await WeatherApiCall(city);
                res.json(weatherData);
            } catch (error) {
                res.status(500).send(error.message);
            }
        }
        
        async function getDayWeather(req, res) {
            const city = req.params.city;
            try {
                const weatherData = await WeatherApiCall(city);
                res.json({weather: weatherData.weather[0].main});
            } catch (error) {
                res.status(500).send(error.message);
            }
        }

        async function getWeatherAndTemperature(req, res) {
            const city = req.params.city;
            try {
                const weatherData = await WeatherApiCall(city);
                res.json({ 
                    weather: weatherData.weather[0].main,
                    temperature: weatherData.main.temp
                 });
            } catch (error) {
                res.status(500).send(error.message);
            }
        }


          module.exports.getAllWeatherData = getAllWeatherData;
          module.exports.getDayWeather = getDayWeather;
          module.exports.getWeatherAndTemperature = getWeatherAndTemperature;
          

