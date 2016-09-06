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
        let sender = Meteor.users.findOne(this.props.message.senderId);
        return (
          <div className='message-other'>
            <div className='col-xs-2 message-user-image' title={ sender.profile.name }>
              <img className='img-rounded' src={ sender.profile.picture } width='32px' />
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
  componentDidMount() {
    if(!this.props.isSender) {
      if(this.props.position !== 'minimized') {
        if(this.props.message.seen !== undefined) {
          if(!this.props.message.seen) {
            Meteor.call('Messages.methods.see', {
              messageId: this.props.message._id
            }, (error, result) => {
              if(error) {
                throw new Meteor.Error(error);
              } else {
                // console.log(result);
              }
            });
          }
        } else if(this.props.message.seers !== undefined) {
          
          let seenMessage = this.props.message.seers.find((seer) => {
            return seer === Meteor.userId();
          });

          if(!seenMessage) {
            Meteor.call('Messages.methods.see', {
              messageId: this.props.message._id,
            }, (error, result) => {
              if(error) {
                throw new Meteor.Error(error);
              } else {
                console.log(result);
              }
            });
          }
        }
      }
    }
  }
}

Message.propTypes = {
  message: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired,
  isSender: React.PropTypes.bool.isRequired,
};
