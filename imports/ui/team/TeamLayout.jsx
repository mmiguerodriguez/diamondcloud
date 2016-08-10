import React from 'react';

import Board from './board/Board.jsx';
import ChatLayout from './chat/ChatLayout.jsx';
import SidebarLayout from './sidebar/SidebarLayout.jsx';

export default class TeamLayout extends React.Component {
  render() {
    console.log(this.props.directChats);
    return (
      <div>
        <SidebarLayout { ...this.props } />
        <Board />
        { this.renderChats() }
      </div>
    );
  }
  
  renderChats() {
    let arr = [];
    
    this.props.directChats.map((chat) => {
      arr.push(
        <ChatLayout 
          key={ chat._id } 
          chat={ chat } 
          position={ 'minimized' }
          boardId={ '' }
          directChatId={ chat._id } />);
    });
    
    return arr;
  }
}

TeamLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
};
