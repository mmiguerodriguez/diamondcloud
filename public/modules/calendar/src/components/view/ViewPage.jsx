import React from 'react';

class ViewPage extends React.Component {
  render() {
    return (
      <div>
        <div className='calendar-navbar' />
        <div id='calendar'></div>
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
        aspectRatio: 2
    });
  }
}

export default ViewPage;
