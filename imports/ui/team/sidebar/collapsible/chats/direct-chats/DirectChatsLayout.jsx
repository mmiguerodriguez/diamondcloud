import React      from 'react';

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
    return this.props.directChats.map((directChat) => {
      return (
        <DirectChat
          key={ directChat._id }
          directChat={ directChat }
          user={ directChat.getUser() }
          notifications={ directChat.getNotifications() }
          addChat={ this.props.addChat } />
      );
    });
  }
}

DirectChatsLayout.propTypes = {
  directChats: React.PropTypes.array.isRequired,
  addChat: React.PropTypes.func.isRequired,
};
