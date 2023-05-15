let isDarkMode = false;
const apiKey = "tamUOtyJWrahIhCMUKtFR2MojLWKK01A";
const currentConditionsApiUrl = "http://dataservice.accuweather.com/currentconditions/v1/";
const citySearchApiUrl = "http://dataservice.accuweather.com/locations/v1/cities/search";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const darkModeBtn = document.querySelector(".dark-mode-btn");
 
darkModeBtn.addEventListener("click", toggleDarkMode);
 
// SEARCH CITY FUNCTION
async function searchCity(city) {
	const response = await fetch(citySearchApiUrl + `?apikey=${apiKey}&q=${city}`);//in this fetch we add the url
 
	if (response.status == 404) {
		document.querySelector(".error").style.display = "block";
		document.querySelector(".weather").style.display = "none";
	} else {
 
		var citySearchData = await response.json();
 
		console.log(citySearchData); // to display information that the API provides us in the console
 
		document.querySelector(".city").innerHTML = citySearchData[0].LocalizedName + ", " + citySearchData[0].Country.LocalizedName;
		if (citySearchData.length == 0) {
			document.querySelector(".error").style.display = "block";
			document.querySelector(".weather").style.display = "none";
		}
		else
			checkWeather(citySearchData[0]);
	}
}
 
async function checkWeather(city) {
 
	const response = await fetch(currentConditionsApiUrl + city.Key + `?apikey=${apiKey}&details=true`);//in this fetch we add the url
 
	if (response.status == 404) {
		document.querySelector(".error").style.display = "block";
		document.querySelector(".weather").style.display = "none";
	} else {
 
		var currentConditionsData = await response.json();
 
		console.log(currentConditionsData, "city current conditiosn"); // to display information that the API provides us in the console
 
		if (currentConditionsData.length == 0) {
			document.querySelector(".error").style.display = "block";
			document.querySelector(".weather").style.display = "none";
		}
 
		const data = {
			name: city.EnglishName,
			main: {
				temp: currentConditionsData[0].Temperature.Metric.Value,
				humidity: currentConditionsData[0].RelativeHumidity,
				temp_max: currentConditionsData[0].TemperatureSummary.Past12HourRange.Maximum.Metric.Value,
				temp_min: currentConditionsData[0].TemperatureSummary.Past12HourRange.Minimum.Metric.Value,
			},
			wind: {
				speed: currentConditionsData[0].Wind.Speed.Metric.Value,
			},
			
			weather: [
				{
					main: currentConditionsData[0].WeatherText,
				}
			],
			visibility: currentConditionsData[0].Visibility.Metric.Value,
			winddirection: currentConditionsData[0].Wind.Direction.English,
		}
 
		console.log(data, "data"); // to display information that the API provides us in the console
 
 
		document.querySelector(".city").innerHTML = data.name; //
 
		if (data && data.main && data.main.temp) {
			document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
		} else {
			console.error("Unable to retrieve temperature data.");
		}
 
		document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
		document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
		document.querySelector(".visibility").innerHTML = data.visibility + " km";
		document.querySelector(".winddirection").innerHTML = data.winddirection;
		document.querySelector(".tempmax").innerHTML = Math.round(data.main.temp_max) + "°C";
		document.querySelector(".tempmin").innerHTML = Math.round(data.main.temp_min) + "°C";
 
		switch (data.weather[0].main) {
			case 'Clouds':
				weatherIcon.src = "images/clouds.png";
				break;
			case 'Clear':
				weatherIcon.src = "images/clear.png";
				break;
			case 'Rain':
				weatherIcon.src = "images/rain.png";
				break;
			case 'Drizzle':
				weatherIcon.src = "images/drizzle.png";
				break;
			case 'Mist':
				weatherIcon.src = "images/mist.png";
				break;
			default:
				break;
		}
 
		document.querySelector(".weather").classList.add("weather-show");
		document.querySelector(".weather-show").style.display = "block";
		document.querySelector(".error").style.display = "none";
 
 
	}
}
// DARK MODE FUNCTION
 
function toggleDarkMode() {
	const body = document.body;
	const card = document.querySelector(".card");
 
	// Toggle the dark mode state
	isDarkMode = !isDarkMode;
 
	// Apply appropriate class changes
	if (isDarkMode) {
		body.classList.add("dark-mode");
		card.classList.add("dark-mode");
	} else {
		body.classList.remove("dark-mode");
		card.classList.remove("dark-mode");
	}
}
 
const conversionBtn = document.querySelector(".conversion-btn");
conversionBtn.addEventListener("click", toggleTemperatureUnit);
 
let isCelsius = true;
 
// CONVERT FROM CELSIUS TO FAHRENHEIT AND VICE VERSA
 
function toggleTemperatureUnit() {
	const temperatureElements = document.querySelectorAll(".temp");
	temperatureElements.forEach(element => {
		const currentTemperature = parseFloat(element.textContent);
		if (isCelsius) {
			const fahrenheit = convertToCelsiusToFahrenheit(currentTemperature);
			element.innerHTML = Math.round(fahrenheit) + "°F";
			conversionBtn.textContent = "Convert to Celsius";
		} else {
			const celsius = convertToFahrenheitToCelsius(currentTemperature);
			element.innerHTML = Math.round(celsius) + "°C";
			conversionBtn.textContent = "Convert to Fahrenheit";
		}
	});
 
	isCelsius = !isCelsius;
}
// CONVERT TO FAHRENHEIT MATHEMATICAL CALCULUS
 
function convertToCelsiusToFahrenheit(celsius) {
	return (celsius * 9) / 5 + 32;
}
 
//CONVERT TO CELSIUS MATHEMATICAL CALCULUS
 
function convertToFahrenheitToCelsius(fahrenheit) {
	return ((fahrenheit - 32) * 5) / 9;
}
 
 
 
searchBtn.addEventListener("click", () => {
	searchCity(searchBox.value);
})// will give the city name written in input, it will pass 	the city name in check weather and will be added in faync function