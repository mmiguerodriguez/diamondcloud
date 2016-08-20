import React from 'react';

export default class Message extends React.Component {
  render() {
    if(this.props.position === 'medium') {
      if(this.props.isSender) {
        let user = Meteor.user();
        return (
          <div className='message-me'>
            <div className='col-xs-9 message-text-container'>
              <p className='message-text'>{ this.props.message.content }</p>
            </div>
            <div className='col-xs-2 message-user-image' title={ user.profile.name }>
              <img className='img-rounded' src={ user.profile.picture } width='32px' />
            </div>
          </div>
        );
      } else {
        let otherUser = Meteor.users.findOne(this.props.message.senderId);
        return (
          <div className='message-other'>
            <div className='col-xs-2 message-user-image' title={ otherUser.profile.name }>
              <img className='img-rounded' src={ otherUser.profile.picture } width='32px' />
            </div>
            <div className='col-xs-9 message-text-container'>
              <p className='message-text'>{ this.props.message.content }</p>
            </div>
          </div>
        );
      }
    } else if(this.props.position === 'maximized') {
      if(this.props.isSender) {
        return (
          <div>Maximized message</div>
        );
      } else {
        return (
          <div>Maximized message</div>
        );
      }
    }
  }
}

Message.propTypes = {
  message: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired,
  isSender: React.PropTypes.bool.isRequired,
};
