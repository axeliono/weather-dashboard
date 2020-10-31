var cityInputEl = document.querySelector(".input");
var cityFormEl = document.querySelector("#city-form");

var fetchCityInfo = function(event) {
    debugger;

    event.preventDefault();

    var city = cityInputEl.value.trim();
    console.log(city);
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=5afd8dce607c094cdbd2b19c029fb72e";
    fetch(apiUrl)
        .then(function(response) {
            response.json().then(function(data){
                console.log(data);
            })
        });
}


cityFormEl.addEventListener("submit",fetchCityInfo);