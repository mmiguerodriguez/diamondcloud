import React from 'react';

import User from './user/User.jsx';

import { Teams } from '../../../api/teams/teams.js';

export default class UsersList extends React.Component {
  render() {
    return (
      <div className="row contacts-list-row">
        <div className="contacts-list col-sm-6 col-xs-12 col-sm-offset-3">
          { this.renderUsers() }
        </div>
      </div>
    );
  }

  renderUsers() {
    let arr = [];
    let users = this.props.team ? this.props.team.getUsers(Teams.dashboardUsersFields) : [];

    users.map((user) => {
      arr.push(<User user={ user } />);
    });

    return arr;
  }

  removeUser(email, teamId) {
    Meteor.call('Teams.methods.removeUser', { email, teamId });
  }
}

UsersList.propTypes = {
  team: React.PropTypes.object
};
