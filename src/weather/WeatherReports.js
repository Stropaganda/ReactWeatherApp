import { React, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import {updateAllReports} from './WeatherService';

const WeatherReports = ({weatherReports, setWeatherReports}) => {
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
    const update = async() => {
        let responses = await updateAllReports(weatherReports);
        const updatedReports = [...weatherReports];
        responses.forEach((response, i) => {
            updatedReports[i] = response.data;
            updatedReports[i].name = weatherReports[i].name;
            updatedReports[i].reportInView = updatedReports[i].current;
            updatedReports[i].daily = updatedReports[i].daily.slice(1, 4);
        });
        setWeatherReports(updatedReports);
    };
    const formatOptions = { month: 'short', day: 'numeric' };
    const dateFormatter = new Intl.DateTimeFormat('en-US', formatOptions);

    useEffect(()=> {
        update();
    },[])

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
                    {dateFormatter.format(new Date(report.reportInView.dt * 1000))}, {report.reportInView.weather[0].main}
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
                      {dateFormatter.format(new Date(day.dt * 1000))}
                  </Button>
                  );
              })}
            </ButtonGroup>
          </Card>
        );
      }
    );
  }

export default WeatherReports;
