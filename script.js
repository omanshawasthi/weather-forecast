const apiKey = "9026670d7974c756391729ab2698a043";

async function getWeather() {
  const city = document.getElementById("city").value;
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");

  resultDiv.innerHTML = "";
  errorDiv.innerHTML = "";

  if (!city) {
    errorDiv.innerHTML = "Please enter a city name!";
    return;
  }

  const unit = document.getElementById("unitSelector").value;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod === "404") {
      errorDiv.innerHTML = "City not found. Please try again.";
    } else {
      const { name, main, weather } = data;
      const description = weather[0].description;
      const temperature = main.temp;
      const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

      resultDiv.innerHTML = `
        <h2>${name}</h2>
        <img src="${iconUrl}" alt="${description}" />
        <p>Temperature: ${temperature}°</p>
        <p>Condition: ${description}</p>
      `;
    }

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (forecastData.cod === "404") {
      errorDiv.innerHTML = "City not found for forecast. Please try again.";
    } else {
      let forecastHtml = "<h3>5-Day Forecast:</h3>";
      for (let i = 0; i < forecastData.list.length; i += 8) {
        const dayData = forecastData.list[i];
        const forecastDate = new Date(dayData.dt * 1000);
        const day = forecastDate.toLocaleDateString();
        const temp = dayData.main.temp;
        const desc = dayData.weather[0].description;
        const icon = dayData.weather[0].icon;

        forecastHtml += `
          <div>
            <p><strong>${day}:</strong> ${temp}°, ${desc}</p>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
          </div>
        `;
      }
      resultDiv.innerHTML += forecastHtml;
    }
  } catch (error) {
    errorDiv.innerHTML = "An error occurred. Please try again later.";
  }
}
