import React        from 'react';

import { Messages } from '../../../api/messages/messages.js';

import Message      from './message/Message.jsx';

export default class ChatLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: this.props.chat,
      position: this.props.position,
    };
  }
  render() {
    if (this.state.position === 'minimized') {
      return (
        <div className='minimized'>
          <div className='chat-bottom'>
            <p className="chat-name">User name</p>
          </div>
        </div>
      );
    } else if (this.state.position === 'medium') {
      return (
        <div className='medium'>
          <div className='chat-bottom'>
            <p className='chat-name'>User name</p>
          </div>
          <div className='messages-container'>
            { this.renderMessages() }
          </div>
        </div>
      );
    } else if (this.state.position === 'maximized') {
      return (
        <div className='maximized'>
          <div className='chat-bottom'>
            <p className='chat-name'>User name</p>
          </div>
          <div className='messages-container'>
            { this.renderMessages() }
          </div>
        </div>
      );
    } else {
      return ( null );
    }
  }

  togglePosition(position) {
    this.setState({
      position: position,
    });
  }
  renderMessages() {
    let arr = [];

    this.props.chat.messages.map((message) => {
      arr.push(
        <Message
          key={ message._id }
          message={ message }
          position={ this.state.position } />);
    });

    return arr;
  }
}

ChatLayout.propTypes = {
  chat: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired,
};
