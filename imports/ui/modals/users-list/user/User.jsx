import React from 'react';

export default class UsersList extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-xs-1">
          <img  className="contact-list-photo"
                alt="User"
                src={ this.props.user.picture || null } />
        </div>
        <div className="col-xs-6">
          <p className="contact-list-name">{ this.props.user.name }</p>
        </div>
        <div className="col-xs-3"></div>
        <div className="col-xs-1">
          <div className="close">
            <img src="/img/close-modal-icon.svg" width="16px" />
          </div>
        </div>
      </div>
    );
  }
}

UsersList.propTypes = {
  user: React.PropTypes.object.isRequired,
};
