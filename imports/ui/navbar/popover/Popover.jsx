import React from 'react';

export default class Popover extends React.Component {
  render() {
    const { name, image, email } = this.props;
    return (
      <div>
        <div className="row popover-data">
          <div className="col-xs-3">
            <img alt="User" src={ image } className="popover-user-photo" />
          </div>
          <div className="col-xs-7">
            <b className="user-info">{ name }</b>
            <p className="user-mail">{ email }</p>
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
  name: React.PropTypes.string.isRequired,
  image: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
};