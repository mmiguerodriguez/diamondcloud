import React from 'react';

export default class WelcomeCard extends React.Component {
  render() {
    return (
      <div>
        { 
          this.props.hasTeams === true 
          ? 
          <h3>Conectate con tu equipo</h3>:<h3>Empezá a colaborar con tu equipo</h3>
        }
      </div>
    );
  }
}

WelcomeCard.propTypes = {
  hasTeams: React.PropTypes.bool.isRequired,
};