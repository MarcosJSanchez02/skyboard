export interface CurrentWeather {
    time : string
    temperature_2m : number
    apparent_temperature : number
    relative_humidity_2m : number
    wind_speed_10m : number
    wheather_code : number
}

   export interface ForecastResponse {
    latitude : number
    longitude : number
    current : CurrentWeather
}