import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Messages } from '../../../api/messages/messages.js';

import Message from './message/Message.jsx';

export default class ChatLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: this.props.chats,
      position: this.props.position,
    };
  }
  render() {
    console.log('ChatLayout -> render -> messages', this.props.messages);
    if (this.state.position === 'minimized') {
      return (
        <div>
          <div className='chat-container minimized'>
            <div className='chat-bottom'>
              <p className="chat-name">Miguel Rodriguez</p>
            </div>
            <div>
              { this.renderMessages() }
            </div>
          </div>
        </div>
      );
    } else if (this.state.position === 'medium') {
      return (
        <div>
          <div className='chat-container medium'>
            <div className='chat-bottom'>
              <p className='chat-name'>Miguel Rodriguez</p>
            </div>
            <div>
              { this.renderMessages() }
            </div>
          </div>
        </div>
      );
    } else if (this.state.position === 'maximized') {
      return (
        <div>
          <div className='chat-container maximized'>
            <div className='chat-bottom'>
              <p className='chat-name'>Miguel Rodriguez</p>
            </div>
            <div>
              { this.renderMessages() }
            </div>
          </div>
        </div>
      );
    } else {
      return ( null ); // Temporary
    }
  }

  renderMessages() {
    let arr = [];

    this.props.messages.map((message) => {
      arr.push(<Message key={ message._id } message={ message } position={ this.state.position } />);
    });

    return arr;
  }
}

/**
 * TODO: Render chat and pass props to <Message />
 */

ChatLayout.propTypes = {
  chat: React.PropTypes.object.isRequired,
  messages: React.PropTypes.array.isRequired,
  position: React.PropTypes.string.isRequired,
};
