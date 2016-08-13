import React from 'react';
import { Meteor } from 'meteor/meteor';

import User from './user/User.jsx';

import { Teams } from '../../../api/teams/teams.js';
import  '../../../api/users/users.js';

export default class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      users: [],
    };
  }

  render() {
    let email = this.state.email;
    return (
      <div>
        <div className="row">
          <div className="input-group col-sm-6 col-xs-12 col-sm-offset-3">
            <input  id="searchUsers"
                    className="form-control"
                    placeholder="Compartir proyecto"
                    type="text"
                    value={ email }
                    onChange={ this.handleChange.bind(this, 'email') }/>
            <div className="input-group-addon search-input" onClick={ this.handleSubmit.bind(this) }>
              <img src="img/add-people-icon.svg"
                   width="24px" />
            </div>
          </div>
        </div>
        <div className="row contacts-list-row">
          <div className="contacts-list col-sm-6 col-xs-12 col-sm-offset-3">
            { this.renderUsers() }
          </div>
        </div>
      </div>
    );
  }
  handleChange(index, event) {
    this.setState({
      [index]: event.target.value,
    });
  }
  handleSubmit() {
    this.props.addUser(this.state.email);
    this.setState({ email: '' });
  }
  renderUsers() {
    let arr = [];
    this.state.users = this.props.team ? this.props.team.getUsers(Teams.dashboardUsersFields) : this.props.usersEmails;
    let users = this.state.users;
    if(!this.props.team) {
      users = JSON.parse(JSON.stringify(this.state.users));
      users.forEach((user, index) => {
        let _user = Meteor.users.findByEmail(user, Teams.dashboardUsersFields).fetch()[0];
        users[index] = _user ? _user : {
          _id: index,
          emails: [
            {
              address: user,
            }
          ],
          profile: {
            name: user,
          },
        };
      });
    }
    users.map((user) => {
      arr.push(<User key={ user._id } user={ user } removeUser={ this.props.removeUser } />);
    });
    return arr;
  }

  removeUser(email, teamId) {
    Meteor.call('Teams.methods.removeUser', { email, teamId });
  }
}

UsersList.propTypes = {
  team: React.PropTypes.object,
  usersEmails: React.PropTypes.array,
  addUser: React.PropTypes.func.isRequired,
  removeUser: React.PropTypes.func.isRequired,
};
