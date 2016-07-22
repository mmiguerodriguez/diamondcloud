import React from 'react';

import TeamCard from './team-card/TeamCard.jsx';

export default class TeamsLayout extends React.Component {
  renderTeams(){
    let teams = [];
    for(let i = 0; i < this.props.teamsCount; i++){
      teams.push(<TeamCard />);
    }
    return teams;
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
  teamsCount: React.PropTypes.number.isRequired,
};