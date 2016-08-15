import React from 'react';

export default class UsersList extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-xs-1">
          <img  className="contact-list-photo"
                alt="User"
                src={ this.props.user.profile.picture || null } />
        </div>
        <div className="col-xs-9">
          <p className="contact-list-name">{ this.props.user.profile.name }</p>
        </div>
        { (!this.props.user.isOwner && this.props.isOwner) ? (
          <div className="col-xs-1">
            <div className="close" onClick={ this.props.removeUser.bind(null, this.props.user.emails[0].address) }>
              <img src="/img/close-modal-icon.svg" width="16px" />
            </div>
          </div>
        ) : null }

      </div>
    );
  }
}

UsersList.propTypes = {
  user: React.PropTypes.object.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  removeUser: React.PropTypes.func.isRequired,
};
