import React from 'react';

export default class Popover extends React.Component {
  render() {
    let user = this.props.user;
    return (
      <div>
        <div className="row popover-data">
          <div className="col-xs-3">
            <img alt="User" src={ user.profile.picture } className="popover-user-photo" />
          </div>
          <div className="col-xs-7">
            <b className="user-info">{ user.profile.name }</b>
            <p className="user-mail">{ user.emails[0].address }</p>
          </div>
        </div>
        <hr />
        <div className="row popover-footer">
          <div className="btn col-xs-4 col-xs-offset-1 popover-btn">
            <p className="popover-btn-text">Cambiar datos</p>
          </div>
          <div className="btn col-xs-4 col-xs-offset-2 popover-btn">
            <p className="popover-btn-text">Cerrar Sesion</p>
          </div>
        </div>
      </div>
    );
  }
}

Popover.propTypes = {
  user: React.PropTypes.object,
};
