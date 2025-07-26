const apiKey = "8a247a9325e0ac9b2b03007c06149f6f"; // Replace with your OpenWeatherMap API key

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name!");

  // Fetch current weather
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then((data) => {
      document.getElementById("cityName").textContent = data.name;
      document.getElementById("description").textContent =
        data.weather[0].description;
      document.getElementById("temp").textContent = data.main.temp;
      document.getElementById("humidity").textContent = data.main.humidity;
      document.getElementById("wind").textContent = data.wind.speed;

      document.getElementById("weatherDisplay").classList.remove("hidden");

      // Fetch 5-day forecast
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
    })
    .then((res) => res.json())
    .then((forecastData) => {
      const forecastContainer = document.getElementById("forecastCards");
      forecastContainer.innerHTML = "";

      // Filter for forecasts at 12:00:00 each day
      const dailyData = forecastData.list.filter((entry) =>
        entry.dt_txt.includes("12:00:00")
      );

      dailyData.forEach((day) => {
        const card = document.createElement("div");
        card.className = "forecast-card";

        const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        card.innerHTML = `
          <h4>${date}</h4>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}" />
          <p>${day.weather[0].main}</p>
          <p>${Math.round(day.main.temp)}°C</p>
        `;

        forecastContainer.appendChild(card);
      });

      document.getElementById("forecast").classList.remove("hidden");
    })
    .catch((error) => {
      alert(error.message);
    });
}
