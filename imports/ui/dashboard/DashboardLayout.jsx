import React from 'react';

import WelcomeCard from './welcome-card/WelcomeCard.jsx';
import TeamsLayout from './teams/TeamsLayout.jsx';
import CreateTeamModal from '../modals/create-team/CreateTeamModal.jsx';

export default class DashboardLayout extends React.Component {
  render() {
    let { teams } = this.props;
    let hasTeams = teams.length > 0 ? true : false;
    
    return (
      <div>
        <WelcomeCard hasTeams={ hasTeams } />
        <TeamsLayout hasTeams={ hasTeams } teams={ teams } openCreateTeamModal={ this.openCreateTeamModal }/>
        <CreateTeamModal /> { /* props: users(image, name, id (to send message) ) */ }
      </div>
    );
  }
  
  openCreateTeamModal() {
    $('#createTeamModal').modal('show');
  }
}

DashboardLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
};