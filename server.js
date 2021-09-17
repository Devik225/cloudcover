//all ejs variables

// ejs_temp
// ejs_city
// ejs_time_date
// ejs_cloud_percent
// ejs_feels_like
// ejs_pressure
// ejs_visibility
// ejs_uv
// ejs_humidity
// ejs_dew
// ejs_wind_speed
// ejs_wind_degree
// ejs_wind_gust



//all variables

let city_name;
let country_code;
let country;
let latitude;
let longitude;

//api data

let api_temp;
let api_city;
let api_time_date;
let api_cloud_percent;
let api_feels_like;
let api_pressure;
let api_visibility;
let api_uv;
let api_humidity;
let api_dew;
let api_wind_speed;
let api_wind_degree;
let api_wind_gust;

let app_id = "a75fd0ffb10a00e19a40a008a31f4398";

//server start----------------->

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

geocode("kota", get_data);

app.get('/', (req, res)=>{
    
    res.render("home", {
        ejs_temp: api_temp, 
        ejs_city: api_city, 
        ejs_time_date: api_time_date,
        ejs_cloud_percent: api_cloud_percent,
        ejs_feels_like: api_feels_like,
        ejs_pressure: api_pressure,
        ejs_visibility: api_visibility,
        ejs_uv: api_uv,
        ejs_humidity: api_humidity,
        ejs_dew: api_dew,
        ejs_wind_speed: api_wind_speed,
        ejs_wind_degree: api_wind_degree,
        ejs_wind_gust: api_wind_gust   
    });

})




app.post('/', (req, res)=>{
    console.log("got the details");
    let city = req.body.city_search;

    geocode(city, get_data);
    setTimeout(() => {
        res.redirect("/");
    }, 1200);  
    
})


//Function to geocode


function geocode(city, callback){

    url_geocoding = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + app_id + "&exclude=local_names"

    https.get(url_geocoding, (response)=>{
        
        response.on("data", (data)=>{
            var values = JSON.parse(data);

            if(values.cod){
                
                console.log("found error");
                
            }
            else{
                city_name = values[0].name;
                country_code = values[0].country;
                country = values[0].country;
                latitude = values[0].lat;
                longitude = values[0].lon;  
                
            }           
            callback();
            
        })
    })

}

//function to get all useful data

function get_data(){

    url_data = "https://api.openweathermap.org/data/2.5/onecall?lat=" +latitude+ "&lon=" +longitude+ "&appid=" + app_id + "&units=metric&exclude=hourly,minutely";

    https.get(url_data, (response)=>{
        
        response.on("data", (data)=>{
            let info = JSON.parse(data);

            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const d = new Date();

            api_temp = Math.round(info.current.temp);
            api_city = city_name + "," +country_code;
            api_time_date = d.getHours() + ":" + d.getMinutes() + " - "+ d.getDate()+ "th" + " " + month[d.getMonth()] + " " + d.getFullYear();
            api_cloud_percent = info.current.clouds + "% cloudiness";
            api_feels_like = "Feels like " + info.current.feels_like + "°C. " + info.current.weather[0].description +".";
            api_pressure = info.current.pressure;
            api_visibility = info.current.visibility/1000;
            api_uv = info.current.uvi;
            api_humidity = info.current.humidity;
            api_dew = info.current.dew_point;
            api_wind_speed = info.current.wind_speed;
            api_wind_degree = info.current.wind_deg;
            api_wind_gust = info.current.wind_gust + " m/s";
            

        })
    })

}


app.listen(3000 || process.env.PORT, ()=>{
    console.log("listening to port 3000");
})



// API
// https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=a75fd0ffb10a00e19a40a008a31f4398&units=metric&exclude=hourly,minutely

// Geo coding
// https://api.openweathermap.org/geo/1.0/direct?q=London&appid=a75fd0ffb10a00e19a40a008a31f4398&exclude=local_names