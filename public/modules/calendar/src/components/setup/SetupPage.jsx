import React from 'react';

class SetupPage extends React.Component {
  render() {
    return (
      <div>
        <p>Hola. Acá va el diseño de ryan. Te mando un abrazo</p>
        <input
          type="text"
          placeholder="Ingresá la url del calendario"
          id="calendar-url"
        />
      </div>
    );
  }
  
  componentDidMount() {
    $('#calendar').fullCalendar({
        // put your options and callbacks here
    });
  }
}

export default SetupPage;
