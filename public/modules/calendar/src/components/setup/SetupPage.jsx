import React from 'react';
import { browserHistory } from 'react-router';

class SetupPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      calendarUrl: '',
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.setup = this.setup.bind(this);
  }
  
  handleChange(index, e) {
    const value = e.target.value;

    this.setState({
      [index]: value,
    });
  }
  
  render() {
    return (
      <div>
        <br />
        <p>Hola. Acá va el diseño de ryan. Te mando un abrazo</p>
        <input
          type="text"
          placeholder="Ingresá la url del calendario"
          id="calendar-url"
          value={this.state.calendarUrl}
          onChange={(e) => this.handleChange('calendarUrl', e)}
        />
        <input
          type="submit"
          onClick={this.setup}
        />
      </div>
    );
  }
  
  setup() {
    const self = this;
    DiamondAPI.insert({
      collection: 'globalValues',
      object: {
        calendarUrl: this.state.calendarUrl,
      },
      isGlobal: true,
      callback(error, response) {
        if (error) {
          self.props.error();
        } else {
          browserHistory.push('/view');
        }
      }
    })
  }
  
  componentDidMount() {
    $('#calendar').fullCalendar({
        // put your options and callbacks here
    });
  }
}

export default SetupPage;
