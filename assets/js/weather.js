var cityInputEl = document.querySelector(".input");
var cityFormEl = document.querySelector("#city-form");
var infoObject = {
    infoType: ["Temperature: ", "Humidity: ", "Wind Speed: "],
    infoData: [],
    units: [" \u2109", "%", " MPH"]
};

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


    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=5afd8dce607c094cdbd2b19c029fb72e";
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok){
                response.json().then(function(data){
                    displayCityWeather(data);
                    saveData(JSON.stringify(data.name));
                    displaySearchHistory();
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
   
    var currentCity = data.name;
    var d = new Date();

    infoObject.infoData = [data.main.temp, data.main.humidity, data.wind.speed];

    var cityTitle = document.createElement("h2");
    cityTitle.className = "title";
    cityTitle.setAttribute("id", "city-name");
    cityTitle.innerHTML = currentCity + "<br>" + " " + d;

    //currentCity + " (" + d.getMonth() + "/" + d.getDay() + "/" + d.getFullYear() + ")";

    
    let infoList = document.createElement("ul");
    infoList.className = "info-list";
    infoList.innerHTML = "";

    for(i = 0; i < infoObject.infoData.length; i++) {
        infoListEl = document.createElement("li");
        infoListEl.innerHTML = infoObject.infoType[i] + infoObject.infoData[i] + infoObject.units[i];
        infoListEl.className = "info-list-item";
        infoList.appendChild(infoListEl);
    }
    document.querySelector("#current-city").appendChild(cityTitle);
    document.querySelector("#current-city").appendChild(infoList);

    //getUVData(data);

    

    
        
};

var getUVData = function(data) {
    var latitude = data.lat;
    var longitude = data.lon;
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+ {latitude}+ "&lon="+{longitude}+"&exclude=hourly,daily&appid=5afd8dce607c094cdbd2b19c029fb72e")
        .then(function(response) {
            response.json().then(function(data) {
                console.log(data);
            })
        })
}

var displayUVData = function() {

}

var saveData = function(currentCity) {
    var searchItemsArr;
    var searchedItems = localStorage.getItem("searchHistory");
    if(searchedItems){
        searchItemsArr = searchedItems.split(",");
        if(localStorage.getItem("searchHistory").indexOf(currentCity) === -1){
            searchItemsArr.push(currentCity);
            localStorage.setItem("searchHistory", searchItemsArr);
            console.log(searchedItems.length);
        }
    }
    else {
        localStorage.setItem("searchHistory", currentCity);
    }
    
    

}

var displaySearchHistory = function() {
    debugger;
    if(!localStorage.getItem("searchHistory")){
        localStorage.setItem("searchHistory", "");
    }
    searchHistory = localStorage.getItem("searchHistory");
    var searchedItemsArr = searchHistory.split(",");
    document.querySelector("#search-history").innerHTML = "";
    for(i = 0; i < searchedItemsArr.length; i++) {
        var cityCard = document.createElement("div");
        cityCard.className = "search-history-card";
        cityCard.innerHTML = searchedItemsArr[i].replace("\"","").replace("\"", "");
        console.log(cityCard);
        cityCard.addEventListener("click", fetchCityInfo(searchedItemsArr[i]));
        document.querySelector("#search-history").appendChild(cityCard);
    }
}






cityFormEl.addEventListener("submit",submitFormHandler);
