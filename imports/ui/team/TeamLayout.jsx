import React         from 'react';

import Board         from './board/Board.jsx';
import ChatLayout    from './chat/ChatLayout.jsx';
import SidebarLayout from './sidebar/SidebarLayout.jsx';

export default class TeamLayout extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      board: this.props.boards[0],
    };
  }
  render() {
    return (
      <div>
        <SidebarLayout { ...this.props } changeBoard={ this.changeBoard.bind(this) } />
        <Board board={ this.state.board } users={ this.props.team.users } getMessages={ this.props.getMessages } />
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
    if(boardId !== this.state.board._id) {
      let board = this.props.boards.find((board) => {
        return board._id === boardId;
      });

      this.setState({
        board: board,
      });
    }
  }
}

TeamLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  chats: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
  removeChat: React.PropTypes.func.isRequired,
};
