import React, { useEffect,useState } from 'react'
import styles from './weather.module.css';
import WeatherBox from './components/WeatherBox';
import WeatherButton from './components/WeatherButton';
import { ClipLoader } from "react-spinners";

const Weather = () => {
  const [weather,setWeather] = useState(null);
  const cities = ['paris','new york','tokyo','seoul'];
  const [city,setCity]=useState('');
  const [loading,setLoading]=useState(true);
  const getCurrentLocation = () =>{
    navigator.geolocation.getCurrentPosition((position)=>{
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      getWeatherByCurrentLocation(lat,lon);
    });
  };

  const getWeatherByCurrentLocation = async (lat,lon)=>{
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0171e55b26877c05d1b25d3b403ca961&units=metric`;
    let response = await fetch(url);
    let data = await response.json();
    setWeather(data);
    setLoading(false);
  }

  const getWeatherByCity= async ()=>{
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0171e55b26877c05d1b25d3b403ca961&units=metric`;
    // API 요청보내기
    let response = await fetch(url);
    // JSON 데이터를 JS 객체로 바꾸는 것
    let data = await response.json();
    setWeather(data);
    setLoading(false)
  }

  useEffect(()=>{
    if(city==""){
      getCurrentLocation()
       document.body.className = 'page-weather';
       return () => { document.body.className = ''; };
    }else{
      getWeatherByCity();
    }
  },[city]);



  return (
    <div className={styles.weatherContainer}>
      <div className={styles.container}>
      {
        loading ? (
          <ClipLoader
            color='#f88c6b'
            loading={loading}
            size={150}
          />
        ) : (
          <>
            <WeatherBox weather={weather} />
            <WeatherButton cities={cities} setCity={setCity} city={city} getCurrentLocation={getCurrentLocation}/>
          </>
        )
      }   
      </div>
    </div>
  )
}

export default Weather
