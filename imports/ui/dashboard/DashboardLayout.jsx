import React from 'react';

import WelcomeCard from './welcome-card/WelcomeCard.jsx';
import TeamsLayout from './teams/TeamsLayout.jsx';

export default class DashboardLayout extends React.Component {
  render() {
    return (
      <div>
        <h2>Dashboard</h2>
        <WelcomeCard hasTeams={ this.props.teams.length > 0 ? true : false } />
        <TeamsLayout teams={ this.props.teams } />
      </div>
    );
  }
}

DashboardLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
};