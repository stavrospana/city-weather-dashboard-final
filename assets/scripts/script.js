/*
Stavros Panagiotopoulos (stavrospana)
SCS Boot Camp Module 6 Weekly Challenge - City Weather Dashboard
Created 10/02/2023      
Last Edited 10/02/2023
*/


//Identify the API key and URL

const apiKey = 'b802f4ee76d24a2cdbd4704e0ff9cf79';
const apiUrl = 'https://api.openweathermap.org/data/2.5';

// Handle form submission

const form = document.getElementById('search-form');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();

    // Fetch current weather and forecast data for the city
    fetchWeatherData(cityName);
});


// Function to save a searched city to local storage
function saveSearchToLocalStorage(city) {
    // Check if local storage is available
    if (typeof Storage !== 'undefined') {
        let searches = JSON.parse(localStorage.getItem('searches')) || [];

        // Add the new search to the beginning of the array if it's not already in the history
        if (!searches.includes(city)) {
            searches.unshift(city);
        }

        // Limit the number of saved searches to, for example, 10
        if (searches.length > 10) {
            searches.pop(); // Remove the oldest search
        }

        // Save the updated searches array to local storage
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

// Function to display recent searches from local storage
function displayRecentSearches() {
    // Check if local storage is available
    if (typeof Storage !== 'undefined') {
        const searches = JSON.parse(localStorage.getItem('searches')) || [];
        const historyList = document.getElementById('history');

        // Clear existing search history
        historyList.innerHTML = '';

        // Display recent searches
        searches.forEach((search) => {
            const li = document.createElement('li');
            li.textContent = search;
            li.addEventListener('click', function () {
                // Handle the click event to perform a new search
                fetchWeatherData(search);
            });
            historyList.appendChild(li);
        });
    }
}

// Function to fetch weather data from an API
function fetchWeatherData(city) {
    // Fetch current weather data
    fetch(`${apiUrl}/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            // Display current weather data
            displayCurrentWeather(data);

            // Fetch 5-day forecast data
            return fetch(`${apiUrl}/forecast?q=${city}&appid=${apiKey}&units=metric`);
        })
        .then((response) => response.json())
        .then((data) => {
            // Display 5-day forecast data
            displayForecast(data);

            // Add the city to the search history
            addToSearchHistory(city);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Function to display current weather data

function displayCurrentWeather(data) {
    const currentWeatherSection = document.getElementById('current-weather');
    currentWeatherSection.innerHTML = ''; // Clear previous data

    const cityName = data.name;
    const date = new Date(data.dt * 1000);
    const iconCode = data.weather[0].icon;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const weatherIconUrl = getWeatherIconUrl(iconCode);

    // Create HTML to display current weather

    const currentWeatherHtml = `
        <h2>${cityName}</h2>
        <p>Date: ${date.toLocaleString()}</p>
        <img src="${weatherIconUrl}" alt="Weather Icon">
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    currentWeatherSection.innerHTML = currentWeatherHtml;
}

// Function to display 5-day forecast data

function displayForecast(data) {
    const forecastSection = document.getElementById('forecast');
    forecastSection.innerHTML = ''; // Clear previous forecast data

    const forecastList = data.list;

    for (let i = 0; i < forecastList.length; i += 8) {
        const forecastData = forecastList[i]; // Every 8th item represents data for a new day
        const forecastDate = new Date(forecastData.dt * 1000);
        const iconCode = forecastData.weather[0].icon;
        const temperature = forecastData.main.temp;
        const humidity = forecastData.main.humidity;
        const windSpeed = forecastData.wind.speed;

        // Create a card to display the forecast
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');

        // Format the date (e.g., "Mon, Sep 30")
        const formattedDate = forecastDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        forecastCard.innerHTML = `
            <h3>${formattedDate}</h3>
            <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
            <p>Temperature: ${temperature} °C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;

        forecastSection.appendChild(forecastCard);
    }
}

// Function to get the URL of a weather icon
function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
}

// Function to add a city to the search history
function addToSearchHistory(cityName) {
    saveSearchToLocalStorage(cityName);
    // Rebuild the search history display
    displayRecentSearches();
}

// Initialize by displaying recent searches when the page loads
displayRecentSearches();
