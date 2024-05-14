import "./style.css";
import Wind from "./images/wind2.png";
import Drop from "./images/drop2.png";
import Sun from "./images/sun2.png";
import Rain from "./images/rain2.png";
import Sunrise from "./images/sunrise.png";
import Sunset from "./images/sunset.png";

const submitButton = document.querySelector(".submit-search");
const form = document.querySelector(".search-form");
const search = document.querySelector("#search");
// const cancel = document.querySelector(".SearchBox-reset");
let tempScaleF = document.querySelector("#F-C");
let tempScaleChange;
let tempScaleChange2;
let state = true;
let ip = true;
// let weatherDataSource = null;

async function searchAutoComplete(data) {
  const search = document.querySelector("#search").value;
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/search.json?key=f9952a9af61f46bb904231739241305q=${data}`,
      {
        mode: "cors",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data. Please try again later.");
    }
    const searchData = await response.json();
    console.log(searchData);
  } catch (e) {
    console.log(e);
  }
}

async function initialLoadIp() {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=f9952a9af61f46bb904231739241305&q=auto:ip&days=8`,
      {
        mode: "cors",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data. Please try again later.");
    }

    const weatherDataSource = await response.json();

    console.log(weatherDataSource);
    console.log(weatherDataSource.current.condition.icon);
    return weatherDataSource;
  } catch (e) {
    console.error(e);
  }
}

async function getWeather() {
  const search = document.querySelector("#search").value;

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=f9952a9af61f46bb904231739241305&q=${search}&days=8`,
      {
        mode: "cors",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data. Please try again later.");
    }
    const weatherDataSource = await response.json();
    ip = false;
    console.log(weatherDataSource);
    return weatherDataSource;
  } catch (e) {
    console.error(e);
    alert(
      "Location not found, try again using either the zip code or name of city, state"
    );
  }
}

function toggle() {
  state = !state;
  if (state) {
    tempScaleF.innerText = "\u00B0F";
  } else {
    tempScaleF.innerText = "\u00B0C";
  }
  tempScaleChange();
  if (ip) {
    renderThreeDay(initialLoadIp);
  } else {
    renderThreeDay(getWeather);
  }

  return state;
}

tempScaleF.addEventListener("click", toggle);

async function renderMain(data) {
  const weatherDataSource = await data();

  const mainWeather = document.querySelector(".main-weather");

  mainWeather.innerHTML = "";

  const city = document.createElement("h2");
  const date = document.createElement("p");
  const img = document.createElement("img");
  const temp = document.createElement("h4");
  const weather = document.createElement("p");
  const high = document.createElement("p");
  const low = document.createElement("p");
  const div = document.createElement("div");
  const tempDiv = document.createElement("div");
  tempDiv.classList.add("flex3");
  const highLowWeather = document.createElement("div");

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const today = new Date();

  tempScaleChange = () => {
    if (state) {
      temp.innerText = `${parseInt(weatherDataSource.current.temp_f)}\u00B0f`;
      high.innerText = `H:${parseInt(
        weatherDataSource.forecast.forecastday[0].day.maxtemp_f
      )}\u00B0f`;
      low.innerText = `L:${parseInt(
        weatherDataSource.forecast.forecastday[0].day.mintemp_f
      )}\u00B0f`;
    } else {
      temp.innerText = `${parseInt(weatherDataSource.current.temp_c)}\u00B0c`;
      high.innerText = `H:${parseInt(
        weatherDataSource.forecast.forecastday[0].day.maxtemp_c
      )}\u00B0c`;
      low.innerText = `L:${parseInt(
        weatherDataSource.forecast.forecastday[0].day.mintemp_c
      )}\u00B0c`;
    }
  };
  div.classList.add("flex");
  weather.innerText = weatherDataSource.current.condition.text;
  console.log((img.src = weatherDataSource.current.condition.icon));
  city.innerText = `${weatherDataSource.location.name}, ${weatherDataSource.location.region}`;
  date.innerText = today.toLocaleDateString("en-US", dateOptions);
  tempScaleChange();
  mainWeather.append(city);
  mainWeather.append(date);
  mainWeather.append(img);
  div.append(high);
  div.append(low);

  tempDiv.append(temp);
  highLowWeather.append(div);
  highLowWeather.append(weather);
  tempDiv.append(highLowWeather);
  mainWeather.append(tempDiv);
}

async function renderOther(data) {
  const otherWeather = document.querySelector(".other-weather");
  otherWeather.innerHTML = "";
  const divs = [];
  const weatherDataSource = await data();
  const title = document.createElement("h2");
  title.innerText = "Details";
  title.classList.add("title");
  otherWeather.append(title);
  for (let i = 0; i < 6; i++) {
    const div = document.createElement("div");
    div.classList.add("flex");
    divs.push(div);
  }

  divs.forEach((div) => {
    const img = document.createElement("img");
    img.classList.add("icon");
    const titleMeasurement = document.createElement("div");
    const weatherTitle = document.createElement("h3");
    const measurement = document.createElement("p");
    titleMeasurement.append(weatherTitle);
    titleMeasurement.append(measurement);
    div.append(img);
    div.append(titleMeasurement);
    otherWeather.append(div);
  });

  divs[0].firstChild.src = Wind;
  divs[1].firstChild.src = Sun;
  divs[2].firstChild.src = Rain;
  divs[3].firstChild.src = Drop;
  divs[4].firstChild.src = Sunrise;
  divs[5].firstChild.src = Sunset;

  divs[0].children[1].firstChild.innerText = "Wind";
  divs[1].children[1].firstChild.innerText = "UV Index";
  divs[2].children[1].firstChild.innerText = "Precipitation";
  divs[3].children[1].firstChild.innerText = "Humidity";
  divs[4].children[1].firstChild.innerText = "Sunrise";
  divs[5].children[1].firstChild.innerText = "Sunset";

  divs[0].lastChild.lastChild.innerText = `${weatherDataSource.current.wind_mph}mph`;
  divs[1].lastChild.lastChild.innerText = `${weatherDataSource.current.uv}`;
  divs[2].lastChild.lastChild.innerText = `${weatherDataSource.forecast.forecastday[0].day.daily_chance_of_rain}%`;
  divs[3].lastChild.lastChild.innerText = `${weatherDataSource.current.humidity}%`;
  divs[4].lastChild.lastChild.innerText = `${weatherDataSource.forecast.forecastday[0].astro.sunrise}`;
  divs[5].lastChild.lastChild.innerText = `${weatherDataSource.forecast.forecastday[0].astro.sunset}`;

  console.log(divs);
}

async function renderThreeDay(data) {
  const threeDay = document.querySelector(".three-day");
  threeDay.innerHTML = "";
  const weatherDataSource = await data();
  const divs = [];
  const title = document.createElement("h2");
  const container = document.createElement("div");
  container.classList.add("flex");
  threeDay.append(title);
  for (let i = 0; i < 7; i++) {
    const div = document.createElement("div");
    div.classList.add("flex2");
    divs.push(div);
  }
  divs.forEach((div, index) => {
    const dayOfWeek = document.createElement("h3");
    const icon = document.createElement("img");
    const chanceOfRain = document.createElement("p");
    const high = document.createElement("p");
    const low = document.createElement("p");
    const highLow = document.createElement("div");
    const options = { weekday: "long" };
    icon.classList.add("icon");

    title.innerText = "This Week";
    dayOfWeek.innerText = new Date(
      weatherDataSource.forecast.forecastday[index + 1].date
    ).toLocaleDateString("en-US", options);
    icon.src =
      weatherDataSource.forecast.forecastday[index + 1].day.condition.icon;
    chanceOfRain.innerText =
      weatherDataSource.forecast.forecastday[index + 1].day
        .daily_chance_of_rain + "%";

    high.innerText = state
      ? "H:" +
        parseInt(
          weatherDataSource.forecast.forecastday[index + 1].day.maxtemp_f
        ) +
        "°"
      : "H:" +
        parseInt(
          weatherDataSource.forecast.forecastday[index + 1].day.maxtemp_c
        ) +
        "°";

    low.innerText = state
      ? "L:" +
        parseInt(
          weatherDataSource.forecast.forecastday[index + 1].day.mintemp_f
        ) +
        "°"
      : "L:" +
        parseInt(
          weatherDataSource.forecast.forecastday[index + 1].day.mintemp_c
        ) +
        "°";

    highLow.append(high);
    highLow.append(low);
    div.append(dayOfWeek);
    div.append(icon);
    div.append(chanceOfRain);
    div.append(highLow);
    container.append(div);
  });
  threeDay.append(container);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  renderMain(getWeather);
  renderOther(getWeather);
  renderThreeDay(getWeather);
});

const reset = document.querySelector(".SearchBox-reset");
reset.addEventListener("click", function () {
  search.focus();
  search.value = "";
  hideResetButton();
});

function hideResetButton() {
  if (search.value !== "") {
    reset.style.display = "block";
  } else {
    reset.style.display = "none";
  }
}

search.addEventListener("keyup", hideResetButton);
// search.addEventListener("keyup", async (e) => {
//   const searchString = e.target.value;

//   if (searchString.length >= 3) {
//     let searchResults = await searchAutoComplete(searchString);
//     console.log(searchResults);
//   }
// });
// searchAutoComplete;

renderMain(initialLoadIp);
renderOther(initialLoadIp);
renderThreeDay(initialLoadIp);
