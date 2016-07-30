import React from 'react';

import TeamCard from './team-card/TeamCard.jsx';

export default class TeamsLayout extends React.Component {
  renderTeams(){
    let { teams, hasTeams } = this.props;
    
    if(hasTeams) {
      return teams.map((team) => {
        return (
          <TeamCard
            key={ team._id }
            team={ team }
            hasTeams={ hasTeams }
          />
        );
      });
    } else {
      return (
        <TeamCard hasTeams={ hasTeams }/>
      );
    }
  }
  render() {
    return (
      <div className="container team-container">
        <div className="row">
          <div className="col-md-6">
            <h3>
              <b>Equipos</b>
            </h3>
          </div>
          <div className="col-md-6">
            <a className="btn btn-default new-team-btn" 
               role="button" 
               onClick={ this.props.openCreateTeamModal }>
              CREAR NUEVO EQUIPO
            </a>
          </div>
        </div>
        <div className="row">
          { this.renderTeams() }
        </div>
      </div>
    );
  }
}

TeamsLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
  hasTeams: React.PropTypes.bool.isRequired,
  openCreateTeamModal: React.PropTypes.func.isRequired,
};