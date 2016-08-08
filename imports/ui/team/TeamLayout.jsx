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
}

TeamLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
};
