import React from 'react'
import styles from '../weather.module.css';
const WeatherBox = ({weather}) => {
  return (
    <div className={styles.weatherBox}>
        <div>{weather?.name}</div>
        <h2>{weather?.main.temp}°C / {((weather?.main.temp * 9) / 5 + 32).toFixed(1)}°F</h2>
        <h3>{weather?.weather[0].description}</h3>
    </div>
  )
}

export default WeatherBox
