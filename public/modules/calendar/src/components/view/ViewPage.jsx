import React from 'react';

import Popover from '../popover/Popover';

class ViewPage extends React.Component {

  render() {
    return (
      <div>
        <div className="calendar-navbar">
          <h3 className="fixed">Calendario</h3>
          <div className="navbar-btn config" />
          <div className="navbar-btn create" />
        </div>
        <div id="calendar" />
      </div>
    );
  }

  componentDidMount() {
    $('#calendar').fullCalendar({
      // put your options and callbacks here
      header: {
        left: 'today prev,next',
        center: 'title',
        right: 'month,list',
      },
      locale: 'es',
      editable: true,
      eventLimit: true,
      eventLimitClick: 'popover',
      eventRender: function (event, element) {
        $(element).popover({
          react: true,
          container: 'body',
          placement: 'auto',
          content: (
            <Popover
              calendarEvent={event}
            />
          ),
        });
      },
      eventSources: [{
        events: [
          {
            title: 'This is a Material Design event!',
            start: '2016-11-13',
            end: '2016-11-18',
            color: '#C2185B !important',
            textColor: '#fff !important',
          },
          {
            title: 'This is a Material Design event!',
            start: '2016-11-13',
            end: '2016-11-18',
            color: '#C2185B !important',
            textColor: '#fff !important',
          },
          {
            title: 'This is a Material Design event!',
            start: '2016-11-13',
            end: '2016-11-18',
            color: '#C2185B !important',
            textColor: '#fff !important',
          },
          {
            title: 'This is a Material Design event!',
            start: '2016-11-13',
            end: '2016-11-18',
            color: '#C2185B !important',
            textColor: '#fff !important',
          },
        ],
      }],
    });
  }
}

export default ViewPage;
