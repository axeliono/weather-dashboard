var cityInputEl = document.querySelector(".input");
var cityFormEl = document.querySelector("#city-form");
var infoObject = {
    infoType: ["Temperature: ", "Humidity: ", "Wind Speed: "],
    infoData: [],
    units: [" \u2109", "%", " MPH"]
};



var submitFormHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
    if(city) {
        fetchCityInfo(city);
    } else {
        alert("Enter a city name");
    }
};




var fetchCityInfo = function(city) {


    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=5afd8dce607c094cdbd2b19c029fb72e";
    fetch(apiUrl)
        .then(function(response) {
            response.json().then(function(data){
                displayCityWeather(data);
                saveData(data.name);
            });
        });
};S

var displayCityWeather = function(data) {
    //clear previous data
    if(document.querySelector("#current-city").hasChildNodes) {
        document.querySelector("#current-city").innerHTML = "";
        let infoList = document.createElement("ul");
        infoList.className = "info-list";
        document.querySelector("#current-city").appendChild(infoList);
    }
   
    var currentCity = data.name;
    var d = new Date();

    infoObject.infoData.push(data.main.temp, data.main.humidity, data.wind.speed);

    var cityTitle = document.createElement("h2");
    cityTitle.className = "title";
    cityTitle.setAttribute("id", "city-name");
    cityTitle.innerHTML = currentCity + " " + d;

    //currentCity + " (" + d.getMonth() + "/" + d.getDay() + "/" + d.getFullYear() + ")";

    
    let infoList = document.querySelector(".info-list");

    for(i = 0; i < infoObject.infoData.length; i++) {
        infoListEl = document.createElement("li");
        infoListEl.innerHTML = infoObject.infoType[i] + infoObject.infoData[i] + infoObject.units[i];
        infoListEl.className = "info-list-item";
        infoList.appendChild(infoListEl);
    }
    document.querySelector("#current-city").appendChild(cityTitle);
    document.querySelector("#current-city").appendChild(infoList);

    

    //var uvsearch = fetch("http://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=5afd8dce607c094cdbd2b19c029fb72e")
        
};

var saveData = function(currentCity) {
    if(!(localStorage.getItem("cities"))) {
        localStorage.setItem("cities", "");
    }

    if(!JSON.stringify(localStorage.getItem("cities")).indexOf(currentCity)) {
        savedCities = JSON.stringify(localStorage.getItem("cities"));
        savedCities = savedCities.split(" ");
    
        if(savedCities.length === 5) {
            savedCities.slice(0);
        }
    
        savedCities.push(currentCity);
        localStorage.setItem("cities", JSON.stringify(savedCities));
    }

}


cityFormEl.addEventListener("submit",submitFormHandler);