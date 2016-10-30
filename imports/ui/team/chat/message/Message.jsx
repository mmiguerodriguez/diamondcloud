import React from 'react';

export default class Message extends React.Component {
  componentDidMount() {
    this.props.scrollDown();

    if (!this.props.isSender) {
      if (this.props.position !== "minimized") {
        if (this.props.message.directChatId) {
          if (!this.props.message.seen) {
            Meteor.call("Messages.methods.see", {
              messageId: this.props.message._id
            }, (error, result) => {
              if (error) {
                // handle error
              }
            });
          }
        } else if (this.props.message.boardId) {
          let seenMessage = this.props.message.seers.find((seer) => {
            return seer === Meteor.userId();
          });

          if (!seenMessage) {
            Meteor.call("Messages.methods.see", {
              messageId: this.props.message._id,
            }, (error, result) => {
              if (error) {
                // handle error
              }
            });
          }
        }
      }
    }
  }

  render() {
    if (this.props.position === 'medium') {
      if (this.props.isSender) {
        const user = Meteor.user();
        return (
          <div className="message-me">
            <div className="col-xs-10 message-text-container">
              <p className="message-text">{this.props.message.content}</p>
              <div className="arrow" />
            </div>
            <div
              className="col-xs-2 message-user-image"
              title={user.profile.name}
            >
              <img className="img-rounded" src={`${user.profile.picture}?sz=60`} width="32px" />
            </div>
          </div>
        );
      } else {
        const sender = Meteor.users.findOne(this.props.message.senderId);
        return (
          <div className="message-other">
            <div
              className="col-xs-2 message-user-image"
              title={sender.profile.name}
            >
              <img className="img-rounded" src={`${sender.profile.picture}?sz=60`} width="32px" />
            </div>
            <div className="col-xs-10 message-text-container">
              <div className="arrow" />
              <p className="message-text">{this.props.message.content}</p>
            </div>
          </div>
        );
      }
    } else if (this.props.position === 'maximized') {
      if (this.props.isSender) {
        const user = Meteor.user();
        return (
          <div className="message-me">
            <div className="col-xs-10 col-xs-offset-1 message-text-container">
              <p className="message-text">{this.props.message.content}</p>
              <div className="arrow maximize" />
            </div>
            <div
              className="col-xs-1 message-user-image"
              title={user.profile.name}
            >
              <img className="img-rounded" src={`${user.profile.picture}?sz=60`} width="48px" />
            </div>
          </div>
        );
      } else {
        const sender = Meteor.users.findOne(this.props.message.senderId);
        return (
          <div className="message-other">
            <div
              className="col-xs-1 message-user-image"
              title={sender.profile.name}
            >
              <img className="img-rounded" src={`${sender.profile.picture}?sz=60`} width="48px" />
            </div>
            <div className="col-xs-10 message-text-container">
              <p className="message-text">{this.props.message.content}</p>
              <div className="arrow maximize" />
            </div>
          </div>
        );
      }
    } else if (this.props.position === 'mobile') {
      if (this.props.isSender) {
        const user = Meteor.user();
        return (
          <div className="message-me">
            <div className="col-xs-10 message-text-container">
              <p className="message-text">{this.props.message.content}</p>
              <div className="arrow" />
            </div>
            <div
              className="col-xs-2 message-user-image"
              title={user.profile.name}
            >
              <img className="img-rounded" src={`${user.profile.picture}?sz=60`} width="32px" />
            </div>
          </div>
        );
      } else {
        const sender = Meteor.users.findOne(this.props.message.senderId);
        return (
          <div className="message-other">
            <div className="col-xs-2 message-user-image" title={sender.profile.name}>
              <img className="img-rounded" src={`${sender.profile.picture}?sz=60`} width="32px" />
            </div>
            <div className="col-xs-10 message-text-container">
              <p className="message-text">{this.props.message.content}</p>
              <div className="arrow" />
            </div>
          </div>
        );
      }
    }
    return (null);
  }
}

Message.propTypes = {
  message: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired,
  isSender: React.PropTypes.bool.isRequired,
  scrollDown: React.PropTypes.func.isRequired,
};
