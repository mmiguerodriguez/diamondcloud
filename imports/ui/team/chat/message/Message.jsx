import { Meteor } from 'meteor/meteor';

import React from 'react';

export default class Message extends React.Component {
  render() {
    if(this.props.position === 'medium') {
      if(this.props.isSender) {
        return (
          <div className='message-me'>
            <div className='col-xs-9 message-text-container'>
              <p className='message-text'>{ this.props.message.content }</p>
            </div>
            <div className='col-xs-2 message-user-image'>
              <img className='img-rounded' src={ Meteor.user().profile.picture } width='32px' /> 
            </div>
          </div>
        );
      } else {
        return (
          <div className='message-other'>
            <div className='col-xs-2 message-user-image'>
              <img className='img-rounded' src={ Meteor.users.findOne(this.props.message.senderId).profile.picture } width='32px' /> 
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
