import React            from 'react';

import Board            from './board/Board.jsx';
import ChatLayout       from './chat/ChatLayout.jsx';
import SidebarLayout    from './sidebar/SidebarLayout.jsx';

export default class TeamLayout extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div>
        <SidebarLayout
          { ...this.props }
          changeBoard={ this.changeBoard.bind(this) } />
        <Board
          board={ this.props.board }
          users={ this.props.team.users }
          getMessages={ this.props.getMessages } />
        <div className='chats-container'>
          { this.renderChats() }
        </div>
      </div>
    );
  }
  renderChats() {
    let arr = [];

    this.props.chats.map((chat) => {
      arr.push(
        <ChatLayout
          key={ chat.directChatId || chat.boardId }
          chat={ chat }
          users={ this.props.team.users }
          boards={ this.props.boards }
          directChats={ this.props.directChats }
          position={ 'medium' }
          removeChat={ this.props.removeChat }/>
      );
    });

    return arr;
  }
  changeBoard(boardId) {
    if(boardId !== this.props.board._id) {
      let board = this.props.boards.find((board) => {
        return board._id === boardId;
      });
    
      this.props.boardSubscribe(board._id);
    }
  }
  
}

TeamLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  board: React.PropTypes.object.isRequired,
  directChats: React.PropTypes.array.isRequired,
  owner: React.PropTypes.bool.isRequired,
  chats: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
  removeChat: React.PropTypes.func.isRequired,
  boardSubscribe: React.PropTypes.func.isRequired,
};
