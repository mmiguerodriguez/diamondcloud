import React from 'react';

// import Board from './board/Board.jsx';
import ChatLayout from './chat/ChatLayout.jsx';
import SidebarLayout from './sidebar/SidebarLayout.jsx';

export default class TeamLayout extends React.Component {
  render() {
    return (
      <div>
        <SidebarLayout { ...this.props } />
        <ChatLayout />
      </div>
    );
  }
  
  renderChats() {
    let arr = [];
    
    this.props.directChats.map((chat) => {
      arr.push(<ChatLayout key={ chat._id } chat={ chat } position={ 'minimized' } />);
    });
    
    return arr;
  }
}

TeamLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
};
