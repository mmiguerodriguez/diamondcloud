import React      from 'react';
import classNames from 'classnames';
import isMobile   from 'ismobilejs';

import Chat       from './chat/Chat';

const CHAT_WIDTH = 250 + 24;

export default class ChatLayout extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { minimizedChats: [] };
  }

  renderChats() {
    const width = $('.board-container').width();
    let chatsWidth = 0;

    return this.props.chats.map((chat, index) => {
      let isHidden = false;
      chatsWidth += CHAT_WIDTH;

      if (chatsWidth > width) {
        chatsWidth -= CHAT_WIDTH;
        isHidden = true;
      }

      return (
        <Chat
          key={chat.directChatId || chat.boardId}
          chat={chat}
          index={index}
          users={this.props.team.users}
          boards={this.props.boards}
          directChats={this.props.directChats}
          position={
            isMobile.any ? 'mobile' : (
              isHidden ? 'hidden' : 'medium'
            )
          }
          togglePosition={this.props.togglePosition}
          toggleError={this.props.toggleError}
          removeChat={this.props.removeChat}
          hasMaximizedChats={this.props.hasMaximizedChats}
        />
      );
    });
  }

  render() {
    return (
      <div className={this.props.class}>
        {this.renderChats()}
      </div>
    );
  }
}

ChatLayout.propTypes = {
  class: React.PropTypes.string.isRequired,
  team: React.PropTypes.object.isRequired,
  chats: React.PropTypes.array.isRequired,
  position: React.PropTypes.string.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  hasMaximizedChats: React.PropTypes.bool.isRequired,
  toggleError: React.PropTypes.func.isRequired,
  togglePosition: React.PropTypes.func.isRequired,
  removeChat: React.PropTypes.func.isRequired,
};
