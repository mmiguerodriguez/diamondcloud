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
    let email = this.state.email;
    let isOwner = this.props.team ? this.props.team.owner() === Meteor.user().emails[0].address : true;
    return (
      <div>
        {
          (isOwner) ? (
            <div className='row'>
              <div className='input-group col-sm-6 col-xs-12 col-sm-offset-3'>
                <input  id='searchUsers'
                        className='form-control'
                        placeholder='Compartir proyecto'
                        type='text'
                        value={ email }
                        onChange={ this.handleChange.bind(this, 'email') }
                        onKeyDown={ this.handleKey.bind(this) } />
                <div className='input-group-addon search-input' onClick={ this.handleSubmit.bind(this) }>
                  <img src='/img/add-people-icon.svg'
                       width='24px' />
                </div>
              </div>
            </div>
          ) : ( null )
        }
        <div className='row contacts-list-row'>
          <div className='contacts-list col-sm-6 col-xs-12 col-sm-offset-3'>
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
  handleKey(event) {
    if(event.which == 13) {
      this.handleSubmit();
    }
  }
  handleSubmit() {
    this.props.addUser(this.state.email);
    this.setState({ email: '' });
  }
  renderUsers() {
    let arr = [],
        users,
        isOwner = false;
    if(this.props.team) {
      users = this.props.team.getUsers(Teams.dashboardUsersFields).fetch();
      let owner = this.props.team.owner();
      if(owner === Meteor.user().emails[0].address) {
        isOwner = true;
      }
      // Unregistered users will be undefined,
      // so we have to replace them with the email
      let emails = [];
      users.forEach((user) => {
        if(user) {
          emails.push(user.emails[0].address);
          if(user.emails[0].address === owner) {
            user.isOwner = true;
          }
        }
      });
      this.props.team.users.forEach((user) => {
        if(emails.indexOf(user.email) === -1){
          users.push({
            _id: user.email,
            emails: [
              {
                address: user.email,
              }
            ],
            profile: {
              name: user.email,
            }
          });
        }
      });
    }
    else {
      isOwner = true;
      users = JSON.parse(JSON.stringify(this.props.usersEmails));
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
      arr.push(<User key={ user._id } user={ user } removeUser={ this.props.removeUser } isOwner={ isOwner } />);
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
