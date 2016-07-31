import React from 'react';

import WelcomeCard from './welcome-card/WelcomeCard.jsx';
import TeamsLayout from './teams/TeamsLayout.jsx';
import CreateTeamModal from '../modals/create-team/CreateTeamModal.jsx';
import ConfigTeamModal from '../modals/config-team/ConfigTeamModal.jsx';

export default class DashboardLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: null,
    };
  }
  render() {
    let { teams } = this.props;
    let hasTeams = teams.length > 0 ? true : false;

    return (
      <div>
        <WelcomeCard hasTeams={ hasTeams } />
        <TeamsLayout  hasTeams={ hasTeams }
                      teams={ teams }
                      openCreateTeamModal={ this.openCreateTeamModal }
                      openConfigTeamModal={ this.openConfigTeamModal.bind(this) } />
        <CreateTeamModal /> { /* props: users(image, name, id (to send message) ) */ }
        <ConfigTeamModal team={ this.state.team }/>
      </div>
    );
  }

  openCreateTeamModal() {
    $('#createTeamModal').modal('show');
  }
  openConfigTeamModal(team) {
    this.setState({ team: team });
    $('#configTeamModal').modal('show');
  }
}

DashboardLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
};
