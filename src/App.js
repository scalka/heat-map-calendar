/*
* Heat Map Calendar by Sylwia Calka
* Main application component
* */

import React, {Component} from 'react';
import './App.css';
import calendar_data from './data.json';
import CalendarHeatmap from 'react-calendar-heatmap';
import {Day, Month} from './Components'
import {
  Button,
  Card,
  CardBody,
  CardColumns,
  CardHeader,
  Col,
  Container,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Row
} from 'reactstrap';
import moment from 'moment'

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: calendar_data, // input data
      current_month: '', // selected month view
      display_day: false,
      display_month: false,
      month_data: [], // data for selected month
      result: [], // edited input data
      months: [], // available months in the dataset
      day: {
        date: '',
        impressions: '',
        clicks: '',
        details: [],
      }, // data for selected day
      clicks_display: true, // checkbox for clicks
      impressions_display: true // checkbox for impressions
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    this.editData();
  }
  // input data transformation
  editData() {
    // grouping by months
    let groups = Object.create(null);
    this.state.data.forEach(item => {
      if (!groups[item.date]) {
        groups[item.date] = [];
      }
      groups[item.date].push({
        date: item.date,
        impressions: item.impressions,
        clicks: item.clicks,
        campaign: item.campaign,
        ad: item.ad
      });
    });

    let result = Object.entries(groups).map(([k, v]) => {
      let total_clicks = 0;
      let total_impressions = 0;
      // changing the total amount depending on the checkbox selected
      for (let el of v) {
        if(this.state.clicks_display === false && this.state.impressions_display === false) {
          total_clicks = 0;
          total_impressions = 0;
        } else {
          if(this.state.clicks_display === true) {
            total_clicks += el.clicks;
          } else {
            total_clicks = 0;
          }
          if (this.state.impressions_display === true) {
            total_impressions += el.impressions;
          } else {
            total_impressions = 0;
          }
        }
      }
      return ({date: k, month: k.substring(0, 7), count: total_clicks + total_impressions, total_clicks: total_clicks, total_impressions: total_impressions, [k]: v})
    });
    // get available months in the data set
    let unique = [...new Set(result.map(element => element.month))];

    this.setState({
      result: result,
      months: unique.sort()
    });
  }
  // toggle for displaying day card
  displayDay(day_data) {
    if (day_data) {
      this.setState({
        day: {
          date: day_data.date,
          impressions: day_data.total_impressions,
          clicks: day_data.total_clicks,
          details: day_data[day_data.date],
        },
        display_day: true
      });
    } else {
        this.setState({
          display_day: false
        });
      }
    }
  // toggle for displaying month card
  showMonth(month) {
    const m = this.state.result.filter( d => {
      return d.month === month
    });
    let hide_month = this.state.current_month === month ? false : true;
    this.setState({
      display_month: hide_month,
      month_data: m,
      current_month: month
    });
  }
  // checkbox handler
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    // set state and call editData as callback
    this.setState(
      { [name]: value, display_month: false, display_day: false }, () => this.editData());
  }

  render() {
    // TODO: create year component
    // year calendar
    const year = (
      <Card>
        <CardHeader>2018</CardHeader>
        <CardBody className="year-display">
            <CalendarHeatmap
            values={this.state.result}
            showMonthLabels = {true}
            showWeekdayLabels = {true}
            startDate={'01-01-2018'}
            horizontal = {true}
            gutterSize = {5} // space between squares
            onClick = { (value) => this.displayDay(value)}
            titleForValue = { (value) => (value ?
              `Date: ${value.date}
              Total: ${value.count}
              Impressions: ${value.total_clicks}
              Clicks: ${value.total_impressions}` : ' ') }
            classForValue={(value) => {
              if (!value) { return 'color-empty'; }
              return `color-filled color-scale-${Math.ceil(value.count/300) * 300}`;
            }}
          />
        </CardBody>
      </Card>
    );

    // Months card from Card component
    const months = this.state.months.map(m => <Button key={m} color="info" onClick={(e) => this.showMonth(m, e)}>{m}</Button>);
    let current_month;
    if (this.state.month_data[0]) { current_month = moment(this.state.month_data[0].date).format('MMM YY'); }
    const month = this.state.display_month ? ( <Month current_month={current_month} month_data={this.state.month_data} onDisplayDayClick={(v) => this.displayDay(v)}/> ) : '';

    // Day card from Day component
    const day = this.state.display_day ?  (<Day
      key = {this.state.day.date}
      date = {this.state.day.date}
      impressions = {this.state.day.impressions}
      clicks = {this.state.day.clicks}
      details = {this.state.day.details}
    />) : '';

    return (
      <div className="App">
        <Container>
        <header className="App-header">
          <h1 className="App-title">Heat Map Calendar by Sylwia Calka</h1>
        </header>
        <Row>
          <Col>
          <Form>
            <FormGroup>
              <Label for="exampleCheckbox"><h3>Heatmaps:</h3></Label>
              <div>
                <CustomInput onChange={this.handleInputChange} checked={this.state.clicks_display} type="checkbox" id="clicks" name="clicks_display" label="Clicks" />
                <CustomInput onChange={this.handleInputChange} checked={this.state.impressions_display} type="checkbox" id="impressions" name="impressions_display" label="Impressions"  />
              </div>
            </FormGroup>
          </Form>
          </Col>
          <Col className="months-buttons-col">
            <h3>Months:</h3>
            {months}
          </Col>
        </Row>
          {year}
        <CardColumns>
          {month}
          {day}
        </CardColumns>
        </Container>
      </div>
    );
  }
}

export default App;
