import React         from 'react';
import Notifications from '../notifications';

export default class Notification extends React.Component {
  // When the component is created, send a notification
  componentDidMount() {
    Notifications.sendNotification({
      title: this.props.title,
      body: this.props.body,
    });
  }

  render() {
    return (
      <div />
    );
  }
}

Notification.propTypes = {
  title: React.PropTypes.string.isRequired,
  body: React.PropTypes.string.isRequired,
};
