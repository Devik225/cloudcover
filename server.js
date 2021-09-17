//all variables

var city_name;
var country;
var latitude;
var longitude;



const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/index.html");
})




app.post('/', (req, res)=>{
    console.log("got the details");
    var city = req.body.city_search;
    
    geocode(city, get_data);  

    res.sendFile(__dirname + "/index.html");
    
})


//Function to geocode

function geocode(city, callback){

    url_geocoding = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=a75fd0ffb10a00e19a40a008a31f4398&exclude=local_names"

    https.get(url_geocoding, (response)=>{
        
        response.on("data", (data)=>{
            var values = JSON.parse(data);
            city_name = values[0].name;
            country = values[0].country;
            latitude = values[0].lon;
            longitude = values[0].lon;  
            
            callback();
        })
    })

}

//function to get all useful data

function get_data(){

    url_data = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=a75fd0ffb10a00e19a40a008a31f4398&units=metric&exclude=hourly,minutely";

    https.get(url_data, (response)=>{
        
        response.on("data", (data)=>{
            var info = JSON.parse(data);
            var temperature = info.current.pressure;

            console.log(temperature);

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