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
    };
  }
  
  render() {
    return (
      <div>
        <div className="row">
          <div className="input-group col-sm-6 col-xs-12 col-sm-offset-3">
            <input  id="searchUsers"
                    className="form-control"
                    placeholder="Compartir proyecto"
                    type="text"
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
    console.log("asdasdasd");
    this.setState({ email: '' });
    this.props.addUser.bind(null, this.state.email);
  }
  renderUsers() {
    let arr = [];
    let users = this.props.team ? this.props.team.getUsers(Teams.dashboardUsersFields) : this.props.usersEmails;
    if(!this.props.team) {//todo: if user does not exist, create a user object
      users.forEach((user, index) => {
        users[index] = Meteor.users.findByEmail(user, Teams.dashboardUsersFields);
      });
    }
    users.map((user) => {
      arr.push(<User key={ user._id } user={ user } />);
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
