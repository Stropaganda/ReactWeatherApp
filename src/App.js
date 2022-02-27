import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {React, useState } from 'react';
import { useLocalStorage } from "./useLocalStorage";
import Container from 'react-bootstrap/Container';
import WeatherReports from './weather/WeatherReports';
import Toaster from './common/Toaster';
import WeatherForm from './weather/WeatherForm';

function App() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [weatherReports, setWeatherReports] = useLocalStorage('weatherReports', []);

  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span>React Weather App</span>
      </header>
      <Container className="p-3">
        <WeatherForm 
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
          weatherReports={weatherReports}
          setWeatherReports={setWeatherReports}>
        </WeatherForm>
        <WeatherReports weatherReports={weatherReports} setWeatherReports={setWeatherReports} />
      </Container>
      <Toaster showToast={showToast} setShowToast={setShowToast} toastMessage={toastMessage} />
    </div>
  );
}

export default App;
