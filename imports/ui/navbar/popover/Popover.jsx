import { Meteor }          from 'meteor/meteor';

import React               from 'react';
import { browserHistory }  from 'react-router';

export default class Popover extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    const self = this;

    Meteor.logout(() => {
      browserHistory.push('/'); // Redirect to landing page
      $('div[role="tooltip"].popover').remove(); // Remove actual node element
      self.props.onLogout(); // Change NavbarLayout props
    });
  }

  render() {
    return (
      <div>
        <div className="row popover-data">
          <div className="col-xs-3">
            <img alt="User" src={`${this.props.user.profile.picture}?sz=60`} className="popover-user-photo" />
          </div>
          <div className="col-xs-9">
            <b className="user-info">{this.props.user.profile.name}</b>
            <p className="user-mail text-muted truncate">{this.props.user.email()}</p>
            <p className="user-mail text-muted truncate">
              {
                this.props.team ? (
                  this.props.team.userHierarchy(this.props.user.email())
                ) : (null)
              }</p>
          </div>
        </div>
        <hr />
        <div className="row popover-footer">
          <div className="btn col-xs-10 col-xs-offset-1 popover-btn" onClick={this.logout}>
            <p className="popover-btn-text">Cerrar Sesion</p>
          </div>
        </div>
      </div>
    );
  }
}

Popover.propTypes = {
  user: React.PropTypes.object.isRequired,
  team: React.PropTypes.object,
  onLogout: React.PropTypes.func.isRequired,
};
