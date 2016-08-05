import React from 'react';

export default class WelcomeCard extends React.Component {
  render() {
    return (
      this.props.hasTeams === true ? (
      <div className="welcome-card row">
        <div className="col-xs-7 welcome-text">
          <h1>
            <b>Conectate con tu equipo</b>
          </h1>
          <p className="text-muted">Aca vamos a tener que poner una bajada para que no quede tan vacio (en gris).</p>
        </div>
        <div className="col-xs-5 welcome-card-photo-div">
          <img src="/img/dashboard.png" className="welcome-card-photo" />
        </div>
      </div> 
      ) : (
      <div className="welcome-card row">
        <div className="col-xs-6 welcome-text">
          <h1>
            <b>Empezá a colaborar con tu equipo</b>
          </h1>
          <p className="text-muted">Aca vamos a tener que poner una bajada para que no quede tan vacio (en gris).</p>
        </div>
        <div className="col-xs-6 welcome-card-photo-div">
          <img src="/img/dashboard.png" className="welcome-card-photo" />
        </div>
      </div> 
      )
    );
  }
}

WelcomeCard.propTypes = {
  hasTeams: React.PropTypes.bool.isRequired,
};