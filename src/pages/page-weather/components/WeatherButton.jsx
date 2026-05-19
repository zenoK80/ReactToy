import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../weather.module.css';
const WeatherButton = ({cities,setCity,city,getCurrentLocation}) => {
  return (
    <div className={styles.buttonGroup}>
      <Button size="lg" variant={city === "" ? "warning" : "light"} onClick={()=>{setCity("");getCurrentLocation();}}>Current Location</Button>
      {cities.map((item, index)=>(
        <Button size="lg" variant={city === item ? "warning" : "light"} key={index} onClick={()=>setCity(item)}>
          {item}
        </Button>
      ))}
    </div>
  )
}

export default WeatherButton
