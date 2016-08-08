import React from 'react';

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
    return (
      <div>
        <div className="chat-container">
          <div className="chat-bottom">
            <p className="chat-name">Miguel Rodriguez</p>
          </div>
        </div>
      </div>
    );
  }
  
  renderMessages() {
    let arr = [];
    
    this.props.chat.map((message) => {
      arr.push(<Message key={ message._id } message={ message } position={ this.state.position } />);
    });
    
    return arr;
  }
}

ChatLayout.propTypes = {
  chat: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired,
};
