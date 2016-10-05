import { Meteor }   from 'meteor/meteor';
import { Boards }   from '/imports/api/boards/boards.js';

import React        from 'react';
import Notification from './Notification.jsx';

export default class NotificationSystem extends React.Component {
  render() {
    return (
      <div>
        { this.renderNotifications() }
      </div>
    );
  }
  renderNotifications() {
    let arr = [];

    this.props.messages.forEach((message) => {
      let isSender = message.senderId === Meteor.userId();
      let seenMessage;

      if (message.seers) {
        seenMessage = message.seers.find((seer) => {
          return seer === Meteor.userId();
        });
      } else {
        seenMessage = message.seen;
      }

      if (!isSender && !seenMessage) {
        let title, body;

        if (!!message.boardId) {
          let sender = Meteor.users.findOne(message.senderId).profile.name;

          title = Boards.findOne(message.boardId).name;
          body = sender + ': ' + message.content
        } else {
          title = Meteor.users.findOne(message.senderId).profile.name;
          body = message.content;
        }

        arr.push(
          <Notification
            key={ message._id }
            title={ title }
            body={ body } />
        );
      }
    });

    return arr;
  }
}

NotificationSystem.propTypes = {
  messages: React.PropTypes.array.isRequired,
};
