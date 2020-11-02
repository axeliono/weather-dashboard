var cityInputEl = document.querySelector(".input");
var cityFormEl = document.querySelector("#city-form");
var infoObject = {
    infoType: ["Temperature: ", "Humidity: ", "Wind Speed: ", "UV Index: "],
    infoData: [],
    units: [" \u2109", "%", " MPH", ""]
};

var typedName;
var d = new Date();


var searchHistory = [];



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


    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=5afd8dce607c094cdbd2b19c029fb72e";
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok){
                response.json().then(function(data){
                    typedName = data.name;
                    saveData(data.name);
                    displaySearchHistory();
                    fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+ data.coord.lat + "&lon="+ data.coord.lon +"&exclude=hourly,minutely&units=imperial&appid=5afd8dce607c094cdbd2b19c029fb72e")
                        .then(function(response) {
                            response.json().then(function(data) {
                                displayCityWeather(data);
                                displayForecast(data);
                                
                            });
                    });
                    
                });
            }
            else {
                alert("Error: " + response.statusText);
            }
            
        });
};

var displayCityWeather = function(data) {
    //clear previous data
    if(document.querySelector("#current-city").hasChildNodes) {
        document.querySelector("#current-city").innerHTML = "";
        let infoList = document.createElement("ul");
        infoList.className = "info-list";
        document.querySelector("#current-city").appendChild(infoList);
    }

    
   
    var currentCity = typedName;

    infoObject.infoData = [data.current.temp, data.current.humidity, data.current.wind_speed, data.current.uvi];

    var cityTitle = document.createElement("h2");
    cityTitle.className = "title";
    cityTitle.setAttribute("id", "city-name");
    cityTitle.innerHTML = currentCity + "<br>" + " " + d;


    
    let infoList = document.createElement("ul");
    infoList.className = "info-list";
    infoList.innerHTML = "";

    for(i = 0; i < infoObject.infoData.length; i++) {
        
        infoListEl = document.createElement("li");
        infoListEl.innerHTML = infoObject.infoType[i] + infoObject.infoData[i] + infoObject.units[i];
        if(infoObject.infoType[i] === "UV: ") {
            infoListEl.className = "info-list-item UV-item";
        }
        else {
            infoListEl.className = "info-list-item";
        }

        
        infoList.appendChild(infoListEl);
    }
    document.querySelector("#current-city").appendChild(cityTitle);
    document.querySelector("#current-city").appendChild(infoList);
    

};

var displayForecast = function(data) {
    console.log(data);
    document.querySelector("#forecast-container").innerHTML = "";
    for(i = 1; i <= 5; i++) {

        var forecastDiv = document.createElement("div");
        var forecastList = document.querySelector("ul")
        forecastList.className = "forecast-info-list"
        forecastDiv.className = "forecast-card";

        var currentList = document.createElement("li");
        

        currentList.innerHTML = (new Date(data.daily[i].dt * 1000)) + " - "
            + (data.daily[i].temp.day + " \u2109") + " - " + (data.daily[i].humidity + "%");

        forecastDiv.appendChild(currentList);
        document.querySelector("#forecast-container").appendChild(forecastDiv);
    }
}

var saveData = function(currentCity) {
    var searchItemsArr;
    var searchedItems = localStorage.getItem("searchHistory");
    if(searchedItems){
        searchItemsArr = searchedItems.split(",");
        if(localStorage.getItem("searchHistory").indexOf(currentCity) === -1){
            searchItemsArr.push(currentCity);
            localStorage.setItem("searchHistory", searchItemsArr);
        }
    }
    else {
        localStorage.setItem("searchHistory", currentCity);
    }
    
    

}



var displaySearchHistory = function() {
    
    if(!localStorage.getItem("searchHistory")){
        localStorage.setItem("searchHistory", "");
    }
    searchHistory = localStorage.getItem("searchHistory");
    var searchedItemsArr = searchHistory.split(",");
    document.querySelector("#search-history").innerHTML = "";
    for(i = 0; i < searchedItemsArr.length; i++) {
        var cityCard = document.createElement("div");
        cityCard.className = "search-history-card";
        cityCard.innerHTML = searchedItemsArr[i].replace("\"","").replace("\"","");
        cityCard.addEventListener("click", function (event) {
            
              fetchCityInfo(event.target.innerText);
            });
        document.querySelector("#search-history").appendChild(cityCard);
    }
}






cityFormEl.addEventListener("submit",submitFormHandler);
displaySearchHistory();
