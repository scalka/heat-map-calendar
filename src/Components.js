/*
* Small reusable components
* */

import React from 'react';
import {Badge, Button, Card, CardBody, CardFooter, CardHeader, CardSubtitle} from 'reactstrap';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';

// Day Card for displaying information about a day
export const Day = (props) => {
  // details for each campaign during a day
  let details = props.details.map(data => {
    return (
      <CardFooter key={data.campaign}>
        <CardSubtitle>{data.campaign}</CardSubtitle>
        Ad: {data.ad} <br/>
        Impressions: {data.impressions} <br/>
        Clicks: {data.clicks} <br/>
      </CardFooter >
      )
  });
  let current_day = moment(props.date).format('DD MMM YY'); // formated header
  return (
    <div className="day-view">
      <Card>
        <CardHeader>{current_day}</CardHeader>
        <CardBody>
          <Tag total_clicks={props.clicks} total={props.clicks+props.impressions} total_impressions={props.impressions}/>
        </CardBody>
        {details}
      </Card>
    </div>
  );
};

// Month Card for displaying information about a Month
export const Month = (props) => {
  let total = 0;
  let total_clicks = 0;
  let total_impressions = 0;

  for (let e of props.month_data) {
    total += e.count;
    total_clicks += e.total_clicks;
    total_impressions += e.total_impressions;
  }

  return (
    <Card className="monthCard">
      <CardHeader>{props.current_month}</CardHeader>
      <CardBody>
        <div className='weekday-label'>
          <span className=" react-calendar-heatmap-weekday-label">S</span>
          <span className=" react-calendar-heatmap-weekday-label">M</span>
          <span className=" react-calendar-heatmap-weekday-label">T</span>
          <span className=" react-calendar-heatmap-weekday-label">W</span>
          <span className=" react-calendar-heatmap-weekday-label">T</span>
          <span className=" react-calendar-heatmap-weekday-label">F</span>
          <span className=" react-calendar-heatmap-weekday-label">S</span>
        </div>
        <CalendarHeatmap
          values={props.month_data}
          startDate= {`${props.month_data[0].month}-01`}
          endDate={`${props.month_data[0].month}-31`}
          showMonthLabels = {false}
          showWeekdayLabels = {false}
          horizontal = {false}
          gutterSize = {1} // space between squares
          onClick = { (value) => props.onDisplayDayClick(value)}
          titleForValue = { (value) => (value ?
            `Date: ${value.date}
             Total: ${value.count}
             Impressions: ${value.total_clicks}
             Clicks: ${value.total_impressions}` : ' ') }
          classForValue={(value) => {
            if (!value) { return 'color-empty'; }
            return `color-filled color-scale-${Math.ceil(value.count/300) * 300}`;
          }}
        /></CardBody>
        <CardBody>
          <Tag total={total} total_clicks={total_clicks} total_impressions={total_impressions}/>
        </CardBody>
    </Card>
  );
};
// Tag for total, clicks and impressions display
export const Tag = (props) => {
  return (
      <div className="tags">
        {props.total ? (<Button size="sm" color="primary" outline disabled>
          Total <Badge color="secondary">{props.total}</Badge>
        </Button>) : ''}
        <Button size="sm" color="primary" outline disabled>
        <i className="fa fa-mouse-pointer"></i>
        <Badge color="secondary">{props.total_clicks}</Badge>
        </Button>
        <Button size="sm" color="primary" outline disabled>
          <i className="fa fa-eye"></i> <Badge color="secondary">{props.total_impressions}</Badge>
        </Button>
      </div>
    )
};
