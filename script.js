const userTab = document.querySelector("[data-userWeather]"); 
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");   
const userInfoContainer = document.querySelector(".user-info-container");   
const apiErrorContainer = document.querySelector(".api-error-container");
// Initially needed at beginning
let currentTab = userTab;                           // by deflaut userTab is click already 1st time when opened
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"; 

currentTab.classList.add("current-tab");            // adding some backfground Properties
// getfromSessionStorage();



function switchTab(clickedTab){
    apiErrorContainer.classList.remove("active");
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab"); 
        currentTab = clickedTab; 
        currentTab.classList.add("current-tab"); 
        
        if(!searchForm.classList.contains("active")){
            //Kya search form wala is invisible hai, if yes then usse visible kr do 
            userInfoContainer.classList.remove("active"); 
            grantAccessContainer.classList.remove("active"); 
            searchForm.classList.add("active"); 
        }
        else{
            //already search form pr hi the , toh ab your weather visible karna padega aur search weather ki visibility hatani padegi
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active"); 
            //ab mai your weather  tab pe aa gaya hu, toh ab weather display karna padega , so let's local storage first for the coordinates, if we saved them there
            getfromSessionStorage(); 
        }
    }

}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

// - - - - - - - - - - - -User Weather Handling- - - - - - - - - - - -
// const grantAccessBtn = document.querySelector("[data-grantAccess]");
const messageText = document.querySelector("[data-messageText]");
const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");

// check if local coordinates are already present here or not , if present then use them and if not then find them 
function getfromSessionStorage(){
    const localCoordinates =  sessionStorage.getItem("user-coordinates"); 
    //agar user-coordinates nahi hai
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    //yadi user-coordinated mil jate hai
    else{
        const Coordinates = JSON.parse(localCoordinates); 
        fetchUserWeatherInfo(Coordinates);                  //latitude or longitude se location find kare
    }
}

// fetch data from API - user weather info
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates; 

    //make grantContainer invisible
    grantAccessContainer.classList.remove("active"); 
    //make loader visible
    loadingScreen.classList.add("active"); 

    // API Call
    try{
        const result = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );   
        
        const data = await result.json(); 
        // console.log("User - Api Fetch Data", data);
        if(!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active"); 
        userInfoContainer.classList.add("active"); 
        renderWeatherInfo(data);  
    }
    catch(error){
        loadingScreen.classList.remove("active"); 
        // HW
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${error?.message}`;
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
    }
}

function renderWeatherInfo(weatherInfo){
        //fistly, we have to fetch the elements 
        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-cloudiness]");

        // console.log(weatherInfo);
    
        //fetch values from weatherINfo object and put it UI elements
        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`; 
        humidity.innerText =`${weatherInfo?.main?.humidity} %`; 
        cloudiness.innerText =`${weatherInfo?.clouds?.all} %`;
}

// Get Coordinates using geoLocation
// https://www.w3schools.com/html/html5_geolocation.asp
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition); 
    }
    else{
        //HW - show an alert for no gelolocation support available
        grantAccessBtn.style.display = "none";
        messageText.innerText = "Geolocation is not supported by this browser.";
    }
}

// Store User Coordinates
function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));            //store localCoordinates from getfromSessionStorage
    fetchUserWeatherInfo(userCoordinates);                                                         //Show weather on UI 
}

// Handle any errors
function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
  }

const grantAccessButton = document.querySelector("[data-grantAccess]"); 
getfromSessionStorage();
grantAccessButton.addEventListener("click",getLocation); 


const searchInput = document.querySelector("[data-searchInput]"); 

// - - - - - - - - - - - -Search Weather Handling- - - - - - - - - - - -
searchForm.addEventListener("submit", (e) => {
        e.preventDefault();                     //this will remove already search work
        let cityName = searchInput.value; 
        if(cityName==="")
            return; 
        else
            fetchSearchWeatherInfo(cityName); 

})

// fetch data from API - Search weather info
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active"); 
    userInfoContainer.classList.remove("active"); 
    grantAccessContainer.classList.remove("active"); 

    try{
        const response = await fetch( 
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );         
        const data = await response.json(); 
        // console.log("Search - Api Fetch Data", data);
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active"); 
        userInfoContainer.classList.add("active"); 
        renderWeatherInfo(data); 
    }
    catch(error){
        // console.log("Search - Api Fetch Error", error.message);
        //HW
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `${error?.message}`;
        apiErrorBtn.style.display = "none";
    }
}

