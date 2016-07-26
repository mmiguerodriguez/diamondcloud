import React from 'react';

export default class WelcomeCard extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.hasTeams === true ? (
          <div className="welcome-card row">
            <div className="col-md-7 welcome-text">
              <h3>
                <b>Conectate con tu equipo</b>
              </h3>
              <p className="text-muted">Aca vamos a tener que poner una bajada para que no quede tan vacio (en gris).</p>
            </div>
            <div className="col-md-5">
              <img src="img/dashboard.png" className="welcome-card-photo" />
            </div>
          </div> 
          ) : (
          <div className="welcome-card row">
            <div className="col-md-6 welcome-text">
              <h3>
                <b>Empezá a colaborar con tu equipo</b>
              </h3>
              <p className="text-muted">Aca vamos a tener que poner una bajada para que no quede tan vacio (en gris).</p>
            </div>
            <div className="col-md-6">
              <img src="img/dashboard.png" className="welcome-card-photo" />
            </div>
          </div> 
          )
        }
      </div>
    );
  }
}

WelcomeCard.propTypes = {
  hasTeams: React.PropTypes.bool.isRequired,
};