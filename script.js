let searchBtn = document.querySelector(".search-btn");
let currentLocationBtn = document.querySelector(".location-btn");
let cityInput = document.querySelector("input");
let currentWeatherDiv = document.querySelector(".current-werather");
let weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = `18c0d7cc99a25e6e0dc885215abae582`;

function getCityCoordinates() {
  let cityName = cityInput.value.trim();

  if (!cityName) {
    alert("Please Enter City Name To Search");
  }

  
  const GEO_CODING_API = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  
  fetch(GEO_CODING_API)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert("City Not Found");
        return;
      }
     
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error Occured While Fetching Data");
    });
}

function getWeatherDetails(cityName, lat, lon) {
  const WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API)
    .then((res) => res.json())
    .then((data) => {
      const uniqueForecastDays = [];

      let fiveDaysForecast = data.list.filter((forecast) => {
        const foreCastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(foreCastDate)) {
          return uniqueForecastDays.push(foreCastDate);
        }
      });

      cityInput.value = "";
      weatherCardsDiv.innerHTML = "";
      currentWeatherDiv.innerHTML = "";
      fiveDaysForecast.forEach((weatherCard, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherCard, index)
          );
        } else {
          weatherCardsDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherCard, index)
          );
        }
      });
    })
    .catch(() => {
      alert("An error Occured While Fetching Weather Data");
    });
}

function createWeatherCard(cityName, weatherCard, index) {
  if (index === 0) {
    return ` <div class="details">
          <h2>${cityName} (${weatherCard.dt_txt.split(" ")[0]})</h2>
          <h4>Temperature : ${(weatherCard.main.temp - 273.15).toFixed(
            2
          )}°C</h4>
          <h4>Wind : ${weatherCard.wind.speed} m/s</h4>
          <h4>Humidity : ${weatherCard.main.humidity}%</h4>
        </div>
        <div class="icon">
         <img src="https://openweathermap.org/img/wn/${
           weatherCard.weather[0].icon
         }@4x.png" alt="weather-icon">
          <h4>${weatherCard.weather[0].description}</h4>
        </div>`;
  } else {
    return `<li class="card">
            <h3>${weatherCard.dt_txt.split(" ")[0]}</h3>
            <img src="https://openweathermap.org/img/wn/${
              weatherCard.weather[0].icon
            }@2x.png" alt="weather-icon">
            <h4>Temperature : ${(weatherCard.main.temp - 273.15).toFixed(
              2
            )}°C</h4>
          <h4>Wind : ${weatherCard.wind.speed} m/s</h4>
          <h4>Humidity : ${weatherCard.main.humidity}%</h4>
          </li>`;
  }
}

function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(
    position => {
    const { latitude, longitude } = position.coords;
    const REVERSE_GEOCODING_API = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
    fetch(REVERSE_GEOCODING_API)
    .then(res => res.json())
    .then(data => {
      const {name} = data[0]
      getWeatherDetails(name, latitude, longitude);
    })
    .catch(() => {
      alert("An error Occured While Fetching Data");
    });
  },
  error =>{
    if(error.code === error.PERMISSION_DENIED){
      alert("You Denied The Request For Location")
    }
  }
);
}

searchBtn.addEventListener("click", getCityCoordinates);
currentLocationBtn.addEventListener("click", getUserCoordinates);
cityInput.addEventListener("keyup", function(dets){
    if (dets.key === "Enter"){
        getCityCoordinates()
    }
});
