import React from 'react';

import Message from './message/Message.jsx';

export default class ChatLayout extends React.Component {
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
}

ChatLayout.propTypes = {

};
