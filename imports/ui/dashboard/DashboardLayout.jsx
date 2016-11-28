import React           from 'react';

import { Teams }       from '../../api/teams/teams.js';

import WelcomeCard     from './welcome-card/WelcomeCard.jsx';
import TeamsLayout     from './teams/TeamsLayout.jsx';
import CreateTeamModal from '../modals/create-team/CreateTeamModal.jsx';
import ConfigTeamModal from '../modals/config-team/ConfigTeamModal.jsx';

export default class DashboardLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = { team: null };
    this.loadTeam = this.loadTeam.bind(this);
    this.openConfigTeamModal = this.openConfigTeamModal.bind(this);
  }
  render() {
    let hasTeams = this.props.teams.length > 0 ? true : false;
    return (
      <div>
        <WelcomeCard
          hasTeams={ hasTeams }
          openCreateTeamModal={ this.openCreateTeamModal } />
        <TeamsLayout
          hasTeams={ hasTeams }
          teams={ this.props.teams }
          openConfigTeamModal={ this.openConfigTeamModal } />
        <CreateTeamModal />
        {
          (this.state.team) ? (
            // TODO: si el usuario tiene algun permiso que requiera que se
            // muestre el modal de configuracion, se tiene que mostrar, pero
            // solo para esos features. EJ: si tiene share_team pero no
            // remove_user, se tiene que mostrar, pero solo share.
            (this.state.team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) ? (
              <ConfigTeamModal
                key={ this.state.team._id }
                team={ this.state.team }
                loadTeam={ this.loadTeam } />
            ) : ( null )
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
