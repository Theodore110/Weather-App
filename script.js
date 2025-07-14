async function getWeather() {
    const apiKey = YourAPIKey;
    const cityInput = document.getElementById('city').value.trim();

    if (!cityInput) {
        alert('Please enter city name');
        return;
    }

    // encode in case user types “São Paulo”, “New York”, etc.
    const city = encodeURIComponent(cityInput);

    const currentWeatherUrl =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Load current weather
        const weatherRes = await fetch(currentWeatherUrl);
        if (!weatherRes.ok) throw new Error('City not found');
        const weatherData = await weatherRes.json();
        displayWeather(weatherData);
    } catch (err) {
        console.error('Current weather error:', err);
        alert(err.message);
        return; // don’t try forecast if city failed
    }

    try {
        // Load 5‑day / 3‑h forecast
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();
        displayHourlyForecast(forecastData.list); // array of 3‑hour slots
    } catch (err) {
        console.error('Forecast error:', err);
        alert('Error fetching hourly forecast. Please try again.');
    }
}

function displayWeather(data) {
    const tempDiv    = document.getElementById('temp-div');
    const infoDiv    = document.getElementById('weather-info');
    const iconImg    = document.getElementById('weather-icon');

    // clear previous
    tempDiv.textContent = '';
    infoDiv.textContent = '';
    iconImg.style.display = 'none';

    // API returns numeric cod; 404 handled in fetch above
    const { name, main, weather } = data;
    const { temp } = main;
    const { description, icon } = weather[0];

    tempDiv.innerHTML = `<p>${Math.round(temp)}&deg;C</p>`;
    infoDiv.innerHTML = `<p>${name}</p><p class="text-capitalize">${description}</p>`;
    iconImg.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    iconImg.alt = description;
    iconImg.style.display = 'block';
}

function displayHourlyForecast(hourly) {
    const wrapper = document.getElementById('hourly-forecast');
    wrapper.innerHTML = ''; // clear previous

    // First 8 slots = next 24 h (3 h spacing)
    hourly.slice(0, 8).forEach(item => {
        const dt        = new Date(item.dt * 1000);
        const hourLabel = dt.getHours().toString().padStart(2, '0') + ':00';
        const temp      = Math.round(item.main.temp);
        const iconUrl   = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        wrapper.insertAdjacentHTML(
            'beforeend',
            `
            <div class="hourly-item">
                <span>${hourLabel}</span>
                <img src="${iconUrl}" alt="">
                <span>${temp}&deg;C</span>
            </div>
            `
        );
    });
}
