// API Key
let apiKey = `edbaf6e2b9460b3c26ac3c51f405ea14`;

// Selecting Search Button from HTML
let searchBtn = document.querySelector("#search");

// Adding Event Listener to Search Button
searchBtn.addEventListener("click", function() { 

        // Grabbing input from search bar
        const cityInput = document.getElementById("city-input");
        const city = cityInput.value;

        function setSavedInput() {
            const savedInput = localStorage.getItem("city");
            if (savedInput) {
                let button = document.createElement("button");
                button.classList.add("btn", "btn-secondary", "btn-block", "mt-2");
                button.textContent = savedInput;
                document.getElementById("recent-search-display").appendChild(button);
                button.addEventListener("click", function() {
                    cityInput.value = savedInput;
                    searchBtn.click();

                    if (cityInput.value === cityInput.value) {
                        button.remove();
                    }
                });

                // Clearing input after search
                cityInput.value = "";
            } else {
                cityInput.value = "";
            }
        }

        // Saving input to local storage
        localStorage.setItem("city", city);
        


        // Establishing URL to fetch data based on city
        let getLatLon = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

        // Fetching API based on city to get lat and lon to use in next API call
        fetch(getLatLon)
            .then(function (response) {
                return(response.json([0]));
            })
            .then(function (data) {
                console.log(data[0]);
                let lat = data[0].lat;
                let lon = data[0].lon;

                // Current Day Card
                let todayAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
                fetch(todayAPIURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                        let date = new Date(data.dt * 1000);
                        document.getElementById("current-card-header").innerHTML = `${data.name} (${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()})`;
                        var iconcode = data.weather[0].icon;
                        var iconurl = `<img src="http://openweathermap.org/img/w/${iconcode}.png" />`;
                        document.getElementById("current-card-title").innerHTML = `${iconurl} ${data.main.temp}°F`;
                        document.getElementById("current-card-text").innerHTML = `Wind Speed: ${data.wind.speed}MPH, Humidity: ${data.main.humidity}%`;
                    })
                    // this is Future Day Cards
                let futureAPIURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
                fetch(futureAPIURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                        const cardTitleArray = [".card-title1", ".card-title2", ".card-title3", ".card-title4", ".card-title5"];
                        const cardTextArray = [".card-text1", ".card-text2", ".card-text3", ".card-text4", ".card-text5"]
                        const cardHeaderArray = [".future-card-header1", ".future-card-header2", ".future-card-header3", ".future-card-header4", ".future-card-header5"]
                        const futureData = data.list;
                        const filteredFutureData = futureData.filter(day => day.dt_txt.includes("12:00:00"));
                        for (let i = 0; i < filteredFutureData.length; i++) {
                            let futureTemp = filteredFutureData[i].main.temp;
                            let futureHumidity = filteredFutureData[i].main.humidity;
                            let futureWind = filteredFutureData[i].wind.speed;
                            let futureIcon = filteredFutureData[i].weather[0].icon;
                            let futureIconURL = `<img src="http://openweathermap.org/img/w/${futureIcon}.png" />`;
                            let futureDate = new Date(filteredFutureData[i].dt_txt);
                        
                            let cardTitleEl = document.querySelector(cardTitleArray[i]);
                            let cardText = document.querySelector(cardTextArray[i]);
                            let cardHeader = document.querySelector(cardHeaderArray[i]);
                        
                            
                            if (cardTitleEl && cardText) {
                                cardHeader.innerText = `${data.city.name} (${futureDate.getMonth() + 1}/${futureDate.getDate()}/${futureDate.getFullYear()})`;
                                cardTitleEl.innerHTML = `${futureIconURL} ${futureTemp}°F`;
                                cardText.innerText = `Wind Speed: ${futureWind}MPH, Humidity: ${futureHumidity}%`;
                            } else {
                                console.error(`Elements not found for index ${i}`);
                            }
                        }
                    })
            })
            setSavedInput();
    }
);