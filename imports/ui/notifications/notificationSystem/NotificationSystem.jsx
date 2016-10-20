import { Meteor }   from 'meteor/meteor';
import React        from 'react';

import { Boards }   from '../../../../imports/api/boards/boards';
import Notification from './Notification';

export default class NotificationSystem extends React.Component {
  renderNotifications() {
    const arr = [];

    this.props.messages.forEach((message) => {
      const isSender = message.senderId === Meteor.userId();
      let seenMessage;

      if (message.seers) {
        seenMessage = message.seers.find(seer => seer === Meteor.userId());
      } else {
        seenMessage = message.seen;
      }

      if (!isSender && !seenMessage) {
        let title;
        let body;

        if (message.boardId) {
          const sender = Meteor.users.findOne(message.senderId).profile.name;

          title = Boards.findOne(message.boardId).name;
          body = `${sender}: ${message.content}`;
        } else {
          title = Meteor.users.findOne(message.senderId).profile.name;
          body = message.content;
        }

        arr.push(
          <Notification
            key={message._id}
            title={title}
            body={body}
          />
        );
      }
    });

    return arr;
  }

  render() {
    return (
      <div>
        {this.renderNotifications()}
      </div>
    );
  }
}

NotificationSystem.propTypes = {
  messages: React.PropTypes.array.isRequired,
};
