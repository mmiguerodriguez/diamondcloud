import React         from 'react';
import Notifications from '../../notifications/notifications';

export default class NotificationsPermissionAsker extends React.Component {
  render() {
    return (
      <div id="notifications-permission-asker">
        <p onClick={Notifications.askPermission.bind(this)}>
          Hacé click acá para habilitar las notificaciones cuando te llegan mensajes
        </p>
        <img 
          className="close-notification-permission" 
          src="/img/close-icon.svg" 
          onClick={this.props.close}
        />
      </div>
    );
  }
}

NotificationsPermissionAsker.propTypes = {
  close: React.PropTypes.func.isRequired,
};
