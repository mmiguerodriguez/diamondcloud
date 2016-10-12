import React from 'react';

export default class UsersList extends React.Component {
  handleChange(index, event) {
    let self = this;
    let value = event.target.value;

    if (index === 'hierarchy') {
      Meteor.call('Teams.methods.changeUserHierarchy', {
        teamId: self.props.team._id,
        userEmail: self.props.user.emails[0].address,
        hierarchy: value,
      }, (error, result) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Changed user hierarchy', result);
        }
      });
    }

    this.setState({
      [index]: value,
    });
  }

  constructor(props) {
    super(props);

    this.state = { hierarchy: this.props.user.hierarchy || 'sistemas' };

    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-1">
          <img
            className="contact-list-photo"
            alt="User"
            src={this.props.user.profile.picture || '/img/user-shape.svg'}
          />
        </div>
        <div className="col-xs-10">
          <p className="contact-list-name truncate">
            {this.props.user.profile.name}
            <select
              id="user-type-edit"
              className="form-control user-type edit"
              value={this.state.hierarchy}
              onChange={(e) => this.handleChange('hierarchy', e)}>
              <option value='sistemas'>Sistemas</option>
              <option value='creativo'>Creativo</option>
              <option value='director creativo'>Director creativo</option>
              <option value='director de cuentas'>Director de cuentas</option>
              <option value='coordinador'>Coordinador</option>
              <option value='administrador'>Administrador</option>
              <option value='medios'>Medios</option>
            </select>
          </p>
        </div>
        {
          this.props.isAdmin ? (
            <div className="col-xs-1">
              <div
                className="close"
                onClick={ this.props.removeUser.bind(null, this.props.user.emails[0].address) }>
                <img src="/img/close-icon.svg" width="16px" />
              </div>
            </div>
          ) : null
        }

      </div>
    );
  }
}

UsersList.propTypes = {
  team: React.PropTypes.object,
  user: React.PropTypes.object.isRequired,
  isAdmin: React.PropTypes.bool.isRequired,
  removeUser: React.PropTypes.func.isRequired,
};
