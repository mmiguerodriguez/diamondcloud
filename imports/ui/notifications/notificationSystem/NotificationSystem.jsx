import { Meteor }   from 'meteor/meteor';
import React        from 'react';

import { Boards }   from '../../../../imports/api/boards/boards';
import Notification from './Notification';

export default class NotificationSystem extends React.Component {
  renderNotifications() {
    let arr = [];
    let authors = [];

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
          authors.push(title);
        } else {
          title = Meteor.users.findOne(message.senderId).profile.name;
          body = message.content;
          authors.push(title);
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

    if (arr.length > 1) {
      const title = 'Tenés nuevos mensajes';
      let body = 'Te llegaron mensajes de ';

      authors = authors.filter((item, pos) => authors.indexOf(item) === pos);

      authors.forEach((author, index) => {
        if (index === authors.length - 2) {
          body += `${author} y `;
        } else if (index === authors.length - 1) {
          body += `${author}.`;
        } else {
          body += `${author}, `;
        }
      });

      arr = [
        <Notification
          key={this.props.messages[0]._id}
          // TODO: Fix this key, right now is random
          title={title}
          body={body}
        />,
      ];
    }

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
