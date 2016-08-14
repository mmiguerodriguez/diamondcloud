import React from 'react';

export default class Message extends React.Component {
  render() {
<<<<<<< HEAD
    console.log('Message -> render -> message', this.props.message);
    return (
      <div>
      </div>
    );
=======
    if(this.props.position === 'medium') {
      if(this.props.isSender) {
        return (
          <div className='message-me'>
            <div className='col-xs-9 message-text-container'>
              <p className='message-text'>{ this.props.message.content }</p>
            </div>
            <div className='col-xs-2 message-user-image'>
              <img className='img-circle' src='//lh3.googleusercontent.com/-ri26AYShk-U/AAAAAAAAAAI/AAAAAAAAAAA/AOtt-yFL9aGQYz1k-cA0Am2Po4dKzi76pA/s96-c-mo/photo.jpg' width='40px' /> 
            </div>
          </div>
        );
      } else {
        return (
          <div className='message-other'>
            <div className='col-xs-2 message-user-image'>
              <img className='img-circle' src='//lh3.googleusercontent.com/-ri26AYShk-U/AAAAAAAAAAI/AAAAAAAAAAA/AOtt-yFL9aGQYz1k-cA0Am2Po4dKzi76pA/s96-c-mo/photo.jpg' width='40px' /> 
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
>>>>>>> 4f364e13d2b89c5e5194ae8171a5f151c6b200e8
  }
}

Message.propTypes = {
  message: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired,
  isSender: React.PropTypes.bool.isRequired,
};
