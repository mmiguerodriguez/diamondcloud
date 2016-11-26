import React from 'react';

class ViewPage extends React.Component {
  render() {
    return (
      <div>
        <div className='calendar-navbar'>
          <h3 className='fixed'>Calendario</h3>
          <div className='navbar-btn config' />
          <div className='navbar-btn create' />
        </div>
        <div id='calendar' />
      </div>
    );
  }

  componentDidMount() {
    $('#calendar').fullCalendar({
        // put your options and callbacks here
        header: {
          left: 'today prev,next',
          center: 'title',
          right:  'month,list'
        },
        eventBackgroundColor: '#3498db',
        eventTextColor: '#eee',
        eventSources: [{
          events: [
            {
              title  : 'event1',
              start  : '2016-11-11'
            },
            {
              title  : 'event2',
              start  : '2016-11-13',
              end    : '2016-11-18',
            },
            {
              title  : 'event3',
              start  : '2016-11-10T12:30:00',
              allDay : false // will make the time show,
            }
          ],
        }],
    });
  }
}

export default ViewPage;
