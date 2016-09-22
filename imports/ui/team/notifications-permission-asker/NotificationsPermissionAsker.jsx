import React             from 'react';
import { Notifications } from '../../notifications/notifications.js';

export default class NotificationsPermissionAsker extends React.Component {
  render() {
    return (
      <div id="notifications-permission-asker">
        <p onClick={ Notifications.askPermission.bind(this) }>Hacé click acá para habilitar las notificaciones cuando te llegan mensajes</p>
        <span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={ this.props.close.bind(null) }></span>
      </div>
    );
  }
}

NotificationsPermissionAsker.propTypes = {
  close: React.PropTypes.func.isRequired,
};
