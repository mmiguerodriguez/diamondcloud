import { Meteor } from 'meteor/meteor';
import { Teams }  from '../../../api/teams/teams';
import  '../../../api/users/users';

import React      from 'react';
import User       from './user/User';

export default class UsersList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { email: '' };

    this.handleKey = this.handleKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(index, event) {
    this.setState({
      [index]: event.target.value,
    });
  }

  handleKey(event) {
    if (event.which == 13) {
      this.handleSubmit();
    }
  }

  handleSubmit() {
    this.props.addUser({
      email: this.state.email,
      hierarchy: this.state.hierarchy,
    });
    this.setState({
      email: '',
    });
  }

  renderUsers() {
    const arr = [];
    let isAdmin = false;
    let users;

    if (this.props.team) {
      users = this.props.team.getUsers(Teams.dashboardUsersFields).fetch();
      isAdmin = this.props.team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas');

      // Unregistered users will be undefined,
      // so we have to replace them with the email
      const emails = [];

      users.forEach((user, index) => {
        if (user) {
          emails.push(user.email());
          const hierarchy = this.props.team.users.find((element) => {
            return element.email === user.email();
          }).hierarchy;
          users[index].hierarchy = hierarchy;
        }
      });

      this.props.team.users.forEach((user) => {
        if (emails.indexOf(user.email) === -1) {
          users.push({
            _id: user.email,
            emails: [
              { address: user.email },
            ],
            profile: {
              name: user.email,
            },
            hierarchy: user.hierarchy,
          });
        }
      });
    } else {
      isAdmin = true;
      users = JSON.parse(JSON.stringify(this.props.users));

      users.forEach((user, index) => {
        const _user = Meteor.users.findByEmail(user.email, Teams.dashboardUsersFields);

        users[index] = _user ? { ..._user, hierarchy: user.hierarchy } : {
          _id: index,
          emails: [
            { address: user.email },
          ],
          profile: {
            name: user.email,
          },
          hierarchy: user.hierarchy,
        };
      });
    }

    users.map((user) => {
      arr.push(
        <User
          key={user._id}
          user={user}
          isAdmin={isAdmin}
          team={this.props.team}
          removeUser={this.props.removeUser}
        />
      );
    });

    return arr;
  }

  render() {
    const email = this.state.email;
    const isAdmin = this.props.team ? this.props.team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas') : true;

    return (
      <div>
        {
          (isAdmin) ? (
            <div className="row container-fluid">
              <div className="input-group col-xs-12">
                <input
                  id="searchUsers"
                  className="form-control"
                  placeholder="Compartir equipo"
                  type="text"
                  value={email}
                  onChange={e => this.handleChange('email', e)}
                  onKeyDown={this.handleKey}
                />
                <select
                  className="form-control user-type"
                  id="user-type"
                  value={this.state.hierarchy}
                  onChange={e => this.handleChange('hierarchy', e)}
                >
                  <option hidden value="-1">Jerarquía</option>
                  <option value="sistemas">Sistemas</option>
                  <option value="creativo">Creativo</option>
                  <option value="director creativo">Director creativo</option>
                  <option value="director de cuentas">Director de cuentas</option>
                  <option value="coordinador">Coordinador</option>
                  <option value="administrador">Administrador</option>
                  <option value="medios">Medios</option>
                </select>
                <div className="input-group-addon search-input" onClick={this.handleSubmit}>
                  <img
                    src="/img/add-people-icon.svg"
                    width="24px"
                  />
                </div>
              </div>
            </div>
          ) : (null)
        }
        {
          this.renderUsers().length > 0 ? (
            <div className="row container-fluid contacts-list-row">
              <div className="contacts-list col-xs-12">
                {this.renderUsers()}
              </div>
            </div>
          ) : (null)
        }
      </div>
    );
  }
}

UsersList.propTypes = {
  team: React.PropTypes.object,
  users: React.PropTypes.array,
  addUser: React.PropTypes.func.isRequired,
  removeUser: React.PropTypes.func.isRequired,
};

// TODO: cambiar la interfaz!!!!!!!!
