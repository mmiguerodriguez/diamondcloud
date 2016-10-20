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
          {
            (this.props.directChats.length !== 0) ? (
              this.renderDirectChats()
            ) : (
              <p className='no-chat-text'>No tienes chats activos, para crear uno hacé click en <img src='/img/add-people-icon.svg' width='18px' /></p> 
            )
          }
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
