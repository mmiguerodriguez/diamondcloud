import React from 'react';

import { Notifications } from '../notifications.js';

export default class Notification extends React.Component {
  //when the component is created, send a notification
  render() {
    return (
      <div>
        hola
      </div>
    );
  }

  componentDidMount() {
    Notifications.sendNotification({
      title: this.props.title,
      body: this.props.body,
    });
  }
}

Notification.propTypes = {
  key: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  body: React.PropTypes.string.isRequired,
};
