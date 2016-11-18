import React from 'react';

class SetupPage extends React.Component {
  render() {
    return (
      <div className="setup">
        <h3 className="text-center">Creá un calendario</h3>
        <p><b>Para agregar tu calendario siga las siguientes instrucciones</b></p>
        <ol className="instructions-list">
          <li className="item">
            En la interfaz de Google Calendar, busca el área "Mis calendarios" a la izquierda.
          </li>
          <li className="item">
            Coloca el cursor sobre el calendario que necesitas y haz clic en la flecha hacia abajo.
          </li>
          <li className="item">
            Aparecerá un menú. Haga clic en "Compartir este calendario".
          </li>
          <li className="item">
            Marque "Hacer público este calendario".
          </li>
          <li className="item">
            Asegúrese de que "Compartir sólo mi información de disponibilidad" esté desmarcada.
          </li>
          <li className="item">
            Haz click en "Guardar"
          </li>
        </ol>
        <hr className="fixed" />
        <div className="calendar-link-form">
          <label for="calendarLink">Inserte el link del calendario</label>
          <input type="text" className="form-control" id="calendarLink" placeholder="Link calendario" />
          <div className="upload" />
        </div>
      </div>
    );
  }
}

export default SetupPage;
