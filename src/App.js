import logo from './logo.svg';
import { useState } from 'react';
import moment from 'moment';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocalStorage } from "./useLocalStorage";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const UNITS = "imperial";

function App() {
  //generic section
  function handleErrors(res) {
    if (!res.ok) throw res;
    return res.json();
  }
  function showApiErrors(body) {
    if(body.message === 'not found') {
      setToastMessage('Zipcode not found!');
    } else {
      setToastMessage('Something went wrong!');
    }
    setShowToast(true);
  }

  //form section
  const [zipCode, setZipCode] = useState('');
  const onInputChange = e => setZipCode(e.target.value);
  const onFormSubmit = e => {
    e.preventDefault();
    fetchData();
    setZipCode('');
  }

  //weather section
  const [weatherReports, setWeatherReports] = useLocalStorage('weatherReports', []);
  const onDeleteReport = (e) => {
    const index = Number(e.target.value);
    setWeatherReports(weatherReports.filter((value, i) => i !== index));
  };
  const onSwitchDayInView = (e, day) => {
    const index = Number(e.target.value);
    const updatedReports = [...weatherReports];
    //fixing issue where current temp structure is different than forecast temp structure
    if(day.temp && day.temp.day) {
      day.temp = day.temp.day;
    }
    updatedReports[index].reportInView = day;
    setWeatherReports(updatedReports);
  };

  const fetchData = async () => {
    await fetch(`${process.env.REACT_APP_GEO_API_URL}/zip?zip=${zipCode}&APPID=${process.env.REACT_APP_API_KEY}`)
    .then(handleErrors)
    .then(result => {
      if (weatherReports.some(report => result.name === report.name)) {
        setToastMessage('City is already added!');
        setShowToast(true);
      } else {
        fetch(`${process.env.REACT_APP_WEATHER_API_URL}/onecall?lat=${result.lat}&lon=${result.lon}&units=${UNITS}&APPID=${process.env.REACT_APP_API_KEY}`)
          .then(handleErrors)
          .then(result2 => {
            result2.name = result.name;
            result2.reportInView = result2.current;
            result2.daily = result2.daily.slice(1, 4);
            setWeatherReports([...weatherReports, result2]);
          }).catch(function(error) {
            error.json().then((body) => {
              showApiErrors(body);
            });
          });
      }
    }).catch(function(error) {
      error.json().then((body) => {
        showApiErrors(body);
      });
    });
  }

  const WeatherReports = () => {
    return weatherReports.map((report, i) => {
        // and/or logic here
        return (
          <Card key={report.name} className="mb-3">
            <Card.Body>
            <Container>
              <Row>
                <Col xs={4} md={3} lg={2}>
                  <Card.Img variant="top" src={`${process.env.REACT_APP_ICON_URL}/${report.reportInView.weather[0].icon}.png`} />
                </Col>
                <Col>
                  <Card.Title>{report.name}<CloseButton className="float-end" onClick={onDeleteReport} value={i}/></Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {moment.unix(report.reportInView.dt).format('MMM Do')}, {report.reportInView.weather[0].main}
                  </Card.Subtitle>
                  <Card.Text className="m-0">
                    Temp: {report.reportInView.temp} &deg;F
                  </Card.Text>
                  <Card.Text className="m-0">
                    Humidity: {report.reportInView.humidity}%
                  </Card.Text>
                  <Card.Text className="m-0">
                    Wind Speed: {report.reportInView.wind_speed} miles/hour
                  </Card.Text>
                </Col>
              </Row>
            </Container>
            </Card.Body>
            <ButtonGroup aria-label="Forcasts">
              <Button variant="secondary" onClick={(e) => onSwitchDayInView(e, report.current)} value={i}>
                Current
              </Button>
              {report.daily.map((day, j) => {
                return (
                  <Button variant="secondary" key={j} onClick={(e) => onSwitchDayInView(e, day)} value={i}>
                    {moment.unix(day.dt).format('MMM Do')}
                  </Button>
                  );
              })}
            </ButtonGroup>
          </Card>
        );
      }
    );
  }

  //error section
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span>React Weather App</span>
      </header>
      <Container className="p-3">
        <Form className="mb-3" onSubmit={onFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicZip">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control type="text" name="zipcode" placeholder="Enter Zipcode" onChange={onInputChange} value={zipCode} required />
            <Form.Text className="text-muted">
              Enter the zipcode you wish to get the weather and forecast!
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <WeatherReports/>
      </Container>
      <ToastContainer position='top-end' className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg='danger'>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default App;
