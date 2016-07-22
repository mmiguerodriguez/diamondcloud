import React from 'react';

import WelcomeCard from './welcome-card/WelcomeCard.jsx';
import TeamsLayout from './teams/TeamsLayout.jsx';

export default class DashboardLayout extends React.Component {
  render() {
    return (
      <div>
        <h2>Dashboard</h2>
        <WelcomeCard teamsCount={ this.props.teamsCount } />
        <TeamsLayout teamsCount={ this.props.teamsCount } />
      </div>
    );
  }
}

DashboardLayout.propTypes = {
  teamsCount: React.PropTypes.number.isRequired,
};