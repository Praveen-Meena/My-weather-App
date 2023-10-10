const userTab = document.querySelector("[data-userWeather]"); 
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContanier = document.querySelector("grant-location-container");
const searchForm = document.querySelector(".form-conatiner");
const loadingScreen = document.querySelector(".loading-container");   
const userInfoConatiner = document.querySelector(".user-info-container");   

// Initially needed at beginning
let currentTab = userTab;                           // by deflaut userTab is click already 1st time when opened
const API_KEY = "96f0761ca642902098da0a343f54ae42"; 
currentTab.classList.add("current-Tab");            // adding some backfground Properties

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("active"); 
        currentTab = clickedTab; 
        currentTab.classList.add("active"); 
        
        if(!searchForm.classList.contains("active")){
            //Kya search form wala is invisible hai, if yes then usse visible kr do 
            userTab.classList.remove("active"); 
            grantAccessContanier.classList.remove("active"); 
            searchForm.classList.add("active"); 
        }
        else{
            //already search form pr hi the , toh ab your weather visible karna padega aur search weather ki visibility hatani padegi
            searchForm.classList.remove("active");
            //ab mai your weather  tab pe aa gaya hu, toh ab weather display karna padega , so let's local storage first for the coordinates, if we saved them there
            getfromSessionStorage(); 
        }
    }

}

userTab.addEventListener('clicked', () => {
    switchTab(currentTab); 
}); 
searchTab.addEventListener('clicked', () => {
    switchTab(currentTab); 
});

// check if local coordinates are already present here or not , if present then use them and if not then find them 
function getfromSessionStorage(){
    
}