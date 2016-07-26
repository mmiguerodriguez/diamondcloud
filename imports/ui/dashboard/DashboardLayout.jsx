import React from 'react';

import WelcomeCard from './welcome-card/WelcomeCard.jsx';
import TeamsLayout from './teams/TeamsLayout.jsx';

export default class DashboardLayout extends React.Component {
  render() {
    let { teams } = this.props;
    let hasTeams = teams.length > 0 ? true : false;
    
    return (
      <div>
        <WelcomeCard hasTeams={ hasTeams } />
        <TeamsLayout hasTeams={ hasTeams } teams={ teams } />
      </div>
    );
  }
}

DashboardLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
};