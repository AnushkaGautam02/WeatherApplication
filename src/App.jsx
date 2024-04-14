import { useEffect, useState } from 'react'

import './App.css'
import TopButtons from './Components/TopButtons'
import Inputs from './Components/Inputs'
import TimeAndLocation from './Components/TimeAndLocation'
import TempratureAndDetails from './Components/TempratureAndDetails'
import Forecast from './Components/Forecast'
import getFormattedWeatherData from './services/weatherService'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  
 const [query, setQuery] = useState({})

 useEffect(()=>{

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position)=>{
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        setQuery({
            lat, lon
        })
    })
}
},[])
 const [units, setUnits] = useState('metric')
 const [weather, setWeather] = useState(null)

 useEffect(()=>{

  const fetchWeather = async () =>{
    const message = query.q ? query.q: "Current Location"
    toast.info("Featchin weather for"+ message)
     await getFormattedWeatherData({...query, units}).then((data)=>{
      toast.success(`Successfully fetched weather for ${data.name}, ${data.country}.`)
      setWeather(data)
     })
    
  };

  fetchWeather()

 },[query, units])

 const formatBackgound = () =>{
  //console.log(weather.details)

  // if(!weather) return "from-cyan-700 to to-blue-700";

  // const theshold = units === 'mertic' ? 20 : 60;

  // if(weather.temp <= theshold) return 'from-cyan-700 to-blue-700';

  // return 'from-yellow-700 to-orange-700';

  if (!weather) return "from-cyan-700 to to-blue-700";

// Determine weather conditions based on the data
const weatherCondition = weather.details.toLowerCase();

// Set background colors based on weather conditions
switch (weatherCondition) {
  case 'clouds':
    return 'from-gray-700 to-gray-500';
  case 'haze':
    return 'from-gray-400 to-gray-300';
  case 'clear':
    // Assuming 'clear' weather is cool
    return 'from-cyan-700 to-blue-700';
  case 'rain':
  case 'thunderstorm':
    // Assuming 'rain' and 'thunderstorm' weather is cold
    return 'from-blue-700 to-purple-700';
  default:
    // For any other condition, return a default background
    return 'from-cyan-700 to-blue-700';
}
  
};
  return (
    <>
      <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br ${formatBackgound()} shadow-gray-400`}>
        <TopButtons setQuery= {setQuery}/>
        <Inputs setQuery= {setQuery} units= {units} setUnits={setUnits}/>
        {
          weather && (
            <>
            <TimeAndLocation weather= {weather}/>
            <TempratureAndDetails weather= {weather}/>
            <Forecast title="hourly forecast" items = {weather.hourly}/>
            <Forecast title="Daily forecast" items = {weather.daily}/>
            </>
          )
        }
      </div>
      <ToastContainer autoClose = {5000} theme = "colored" newestOnTop = {true} />
    </>
  )
}

export default App
