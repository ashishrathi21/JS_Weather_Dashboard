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
      console.log(data);
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
      const processedDays = [];
      const dailyData = [];

      for (let i = 0; i < data.list.length; i++) {
        const forecastDate = new Date(data.list[i].dt_txt);
        const day = forecastDate.getDate();

        if (!processedDays.includes(day)) {
          processedDays.push(day);
          dailyData.push(data.list[i]);
        }

        if (dailyData.length === 7) break;
      }

      cityInput.value = "";
      weatherCardsDiv.innerHTML = "";
      currentWeatherDiv.innerHTML = "";

      dailyData.forEach((weatherCard, index) => {
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
      alert("An error occurred while fetching weather data");
    });
}

function createWeatherCard(cityName, weatherCard, index) {
  const dayName = new Date(weatherCard.dt_txt).toLocaleDateString("en-US", {
    weekday: "long",
  });

  if (index === 0) {
    return `
     <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; width: 100%;">
    
    <div class="details" style="flex: 1; min-width: 200px;">
      <h2 style="margin: 0 0 8px 0;">${cityName} (${dayName})</h2>
      <h4 style="margin: 4px 0;">Temperature: ${(weatherCard.main.temp - 273.15).toFixed(2)}°C</h4>
      <h4 style="margin: 4px 0;">Wind: ${weatherCard.wind.speed} m/s</h4>
      <h4 style="margin: 4px 0;">Humidity: ${weatherCard.main.humidity}%</h4>
    </div>

    <div style="display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 150px;">
      <h4 style="font-size: 2rem; margin: 0;">${(weatherCard.main.temp - 273.15).toFixed(2)}°C</h4>
      <h6 style="margin: 6px 0 0 0;">${weatherCard.wind.speed} m/s | ${weatherCard.main.humidity}%</h6>
    </div>

    <div class="icon" style="flex: 1; text-align: center; min-width: 150px;">
      <img 
        src="https://openweathermap.org/img/wn/${weatherCard.weather[0].icon}@4x.png" 
        alt="weather-icon"
        style="width: 100px; height: 100px; display: block; margin: 0 auto;"
      >
      <h4 style="margin-top: 10px; text-transform: capitalize;">
        ${weatherCard.weather[0].description}
      </h4>
    </div>

  </div>
`;
  } else {
    return `
        <li class="card">
          <h3>${dayName}</h3>
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
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_API = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(REVERSE_GEOCODING_API)
        .then((res) => res.json())
        .then((data) => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("An error Occured While Fetching Data");
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("You Denied The Request For Location");
      }
    }
  );
}

searchBtn.addEventListener("click", getCityCoordinates);
currentLocationBtn.addEventListener("click", getUserCoordinates);
cityInput.addEventListener("keyup", function (dets) {
  if (dets.key === "Enter") {
    getCityCoordinates();
  }
});
