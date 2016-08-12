import React from 'react';

import DirectChat from './direct-chat/DirectChat.jsx';

export default class DirectChatsLayout extends React.Component {
  render() {
    return (
      <div className='container-fluid'>
        <h5>
          <b>Chats</b>
        </h5>
        <hr className='hr-fixed-color' />
        <div>
          { this.renderDirectChats() }
        </div>
      </div>
    );
  }

  renderDirectChats() {
    let arr = [];

    this.props.directChats.map((directChat) => {
      arr.push(
        <DirectChat
          key={ directChat._id }
          directChat={ directChat }
          getMessages={ this.props.getMessages } />
      );
    });

    return arr;
  }
}

DirectChatsLayout.propTypes = {
  directChats: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
