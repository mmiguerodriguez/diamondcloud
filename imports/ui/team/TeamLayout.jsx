import React from 'react';

import Board from './board/Board.jsx';
import ChatLayout from './chat/ChatLayout.jsx';
import SidebarLayout from './sidebar/SidebarLayout.jsx';

export default class TeamLayout extends React.Component {
  render() {
    console.log('TeamLayout -> chats: ', this.props.chats);
    return (
      <div>
        <SidebarLayout { ...this.props } />
        <Board />
        <div className=""> { /* full width of screen, contains all the chats */ }
          { this.renderChats() }
        </div>
      </div>
    );
  }

  renderChats() {
    let arr = [];

    this.props.chats.map((chat) => {
      arr.push(<ChatLayout chat={ chat } position={ 'minimized' } />);
    });

    return arr;
  }
}

/**
 * TODO: Render chat, pass props so it can render
 * messages correctly
 */

TeamLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  chats: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
