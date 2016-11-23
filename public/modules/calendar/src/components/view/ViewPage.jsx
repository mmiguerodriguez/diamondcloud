import React from 'react';

class ViewPage extends React.Component {
  render() {
    return (
      <div id='calendar'></div>
    );
  }
  
  componentDidMount() {
    $('#calendar').fullCalendar({
        // put your options and callbacks here
    });
  }
}

export default ViewPage;
