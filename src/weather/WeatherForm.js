import {React, useState } from 'react';
import {fetchLocation, fetchWeather} from './WeatherService';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useLocalStorage } from "../useLocalStorage";

const WeatherForm = ({setToastMessage, setShowToast, weatherReports, setWeatherReports}) => {
    const [zipCode, setZipCode] = useState('');
    const onInputChange = (e) => {
        const zipCode = e.target.value.replace(/\D/g, "");
        setZipCode(zipCode);
    };
    const showApiErrors = (body) => {
        if(body.message === 'not found') {
            setToastMessage('Zipcode not found!');
        } else {
            setToastMessage('Something went wrong!');
        }
        setShowToast(true);
    }
    const onFormSubmit = async(e) => {
        e.preventDefault();
        let response = await fetchLocation(zipCode);
        if(response.status !== 200) {
            showApiErrors(response.body);
        }
        let data = response.data;
        if (weatherReports.some(report => data.name === report.name)) {
            setToastMessage('City is already added!');
            setShowToast(true);
        } else {
            let response2 = await fetchWeather(data.lat, data.lon, data.name);
            if(response2.status !== 200) {
                showApiErrors(response2.body);
            }
            let data2 = response2.data;
            data2.name = data.name;
            data2.reportInView = data2.current;
            data2.daily = data2.daily.slice(1, 4);
            setWeatherReports([...weatherReports, data2]);
        }
        setZipCode('');
    }

    return (
        <Form className="mb-3" onSubmit={onFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicZip">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control type="text" name="zipcode" placeholder="Enter Zipcode" onChange={onInputChange} value={zipCode} required maxLength="5"/>
            <Form.Text className="text-muted">
              Enter the zipcode you wish to get the weather and forecast!
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
    );
}

export default WeatherForm;