import React      from 'react';
import classNames from 'classnames';
import isMobile   from 'ismobilejs';

import Chat       from './chat/Chat';

const CHAT_WIDTH = 250 + 24;

export default class ChatLayout extends React.Component {
  renderChats() {
    const width = $('.board-container').width();
    let chatsWidth = 0;

    return this.props.chats.map((chat, index) => {
      chatsWidth += CHAT_WIDTH;

      if (chatsWidth > width) {
        chatsWidth -= CHAT_WIDTH;

        return (null);
      }

      return (
        <Chat
          key={chat.directChatId || chat.boardId}
          chat={chat}
          index={index}
          chats={this.props.chats}
          users={this.props.team.users}
          boards={this.props.boards}
          directChats={this.props.directChats}
          position={
            isMobile.any ? 'mobile' : 'medium'
          }
          togglePosition={this.props.togglePosition}
          toggleError={this.props.toggleError}
          removeChat={this.props.removeChat}
          hasMaximizedChats={this.props.hasMaximizedChats}
        />
      );
    });
  }

  renderHiddenChats() {
    const width = $('.board-container').width();
    let chatsWidth = 0;

    return this.props.chats.map((chat, index) => {
      chatsWidth += CHAT_WIDTH;

      if (chatsWidth > width) {
        chatsWidth -= CHAT_WIDTH;
        return (
          <Chat
            key={chat.directChatId || chat.boardId}
            chat={chat}
            index={index}
            chats={this.props.chats}
            users={this.props.team.users}
            boards={this.props.boards}
            directChats={this.props.directChats}
            position={
              isMobile.any ? 'mobile' : 'hidden'
            }
            togglePosition={this.props.togglePosition}
            toggleError={this.props.toggleError}
            removeChat={this.props.removeChat}
            hasMaximizedChats={this.props.hasMaximizedChats}
          />
        );
      }

      return (null);
    });
  }

  render() {
    const width = $('.board-container').width();
    const chats = this.renderChats();
    const hiddenChats = this.renderHiddenChats();

    return (
      <div className={this.props.class}>
        {chats}
        {
          hiddenChats.length > 0 && chats.length > Math.floor(width / CHAT_WIDTH) ? (
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
  removeChat: React.PropTypes.func.isRequired,
};
