import axios from 'axios';

const UNITS = "imperial";

export const fetchLocation = async (zip) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_GEO_API_URL}/zip?zip=${zip}&APPID=${process.env.REACT_APP_API_KEY}`)
        return response;
    } catch (error) {
        return error.response;
    }
}

export const fetchWeather = async (lat, lon) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_WEATHER_API_URL}/onecall?lat=${lat}&lon=${lon}&units=${UNITS}&APPID=${process.env.REACT_APP_API_KEY}`)
        return response;
    } catch (error) {
        return error.response;
    }
}

export const updateAllReports = async (weatherReports) => {
    let promiseArray = [];
    weatherReports.forEach((report) => {
      promiseArray.push(fetchWeather(report.lat, report.lon, report.name));
    });
    try {
        const responses = await axios.all(promiseArray)
        return responses;
    } catch (error) {
        return error.response;
    }
}