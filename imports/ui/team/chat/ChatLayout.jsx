import React from 'react';

import Chat  from './chat/Chat';

export default class ChatLayout extends React.Component {
  renderChats() {
    const chats = [];

    this.props.chats.forEach((chat, index) => {
      if (chat.position !== 'hidden') {
        chats.push(
          <Chat
            key={chat.directChatId || chat.boardId}
            index={index}
            chat={chat}
            position={chat.position}
            chats={this.props.chats}
            users={this.props.team.users}
            boards={this.props.boards}
            directChats={this.props.directChats}
            openHiddenChat={this.props.openHiddenChat}
            togglePosition={this.props.togglePosition}
            toggleError={this.props.toggleError}
            removeChat={this.props.removeChat}
            hasMaximizedChats={this.props.hasMaximizedChats}
          />
        );
      }
    });

    return chats;
  }

  renderHiddenChats() {
    const chats = [];

    this.props.chats.forEach((chat, index) => {
      if (chat.position === 'hidden') {
        chats.push(
          <Chat
            key={chat.directChatId || chat.boardId}
            index={index}
            chat={chat}
            position={chat.position}
            chats={this.props.chats}
            users={this.props.team.users}
            boards={this.props.boards}
            directChats={this.props.directChats}
            togglePosition={this.props.togglePosition}
            toggleError={this.props.toggleError}
            openHiddenChat={this.props.openHiddenChat}
            removeChat={this.props.removeChat}
            hasMaximizedChats={this.props.hasMaximizedChats}
          />
        );
      }
    });

    return chats;
  }

  render() {
    const chats = this.renderChats();
    const hiddenChats = this.renderHiddenChats();

    return (
      <div className={this.props.class}>
        {chats}
        {
          hiddenChats.length > 0 ? (
            <div className="users-hidden">
              <div className="users">
                {hiddenChats}
              </div>
            </div>
          ) : (null)
        }
      </div>
    );
  }
}

ChatLayout.propTypes = {
  class: React.PropTypes.string.isRequired,
  team: React.PropTypes.object.isRequired,
  chats: React.PropTypes.array.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  hasMaximizedChats: React.PropTypes.bool.isRequired,
  toggleError: React.PropTypes.func.isRequired,
  togglePosition: React.PropTypes.func.isRequired,
  openHiddenChat: React.PropTypes.func.isRequired,
  removeChat: React.PropTypes.func.isRequired,
};
