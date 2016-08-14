import React from 'react';

import { Teams } from '../../api/teams/teams.js';
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
    let hasTeams = this.props.teams.length > 0 ? true : false;
    return (
      <div>
        <WelcomeCard hasTeams={ hasTeams } />
        <TeamsLayout  hasTeams={ hasTeams }
                      teams={ this.props.teams }
                      openCreateTeamModal={ this.openCreateTeamModal }
                      openConfigTeamModal={ this.openConfigTeamModal.bind(this) } />
        <CreateTeamModal /> { /* props: users(image, name, id (to send message) ) */ }
        {
          (this.state.team) ? (
            <ConfigTeamModal key={ this.state.team._id } team={ this.state.team } loadTeam={ this.loadTeam.bind(this) }/>
          ) : ( null )
        }
      </div>
    );
  }

  openCreateTeamModal() {
    $('#createTeamModal').modal('show');
  }
  openConfigTeamModal(team) {
    this.loadTeam(team._id, () => {
      $('#configTeamModal').modal('show');//show modal once state is updated
    });
  }
  loadTeam(id, callback){
    this.setState({
      team: Teams.findOne(id)
    }, callback);
  }
}

DashboardLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
};
