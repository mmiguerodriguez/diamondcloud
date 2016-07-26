import React from 'react';

import TeamCard from './team-card/TeamCard.jsx';

export default class TeamsLayout extends React.Component {
  renderTeams(){
    let teams = this.props.teams;
    
    return teams.map((team) => {
      return (
        <TeamCard
          key={ team._id }
          team={ team }
        />
      );
    });
  }
  render() {
    return (
      <div>
        { this.renderTeams() }
      </div>
    );
  }
}

TeamsLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
};