import React            from 'react';

import Board            from './board/Board.jsx';
import ChatLayout       from './chat/ChatLayout.jsx';
import SidebarLayout    from './sidebar/SidebarLayout.jsx';

export default class TeamLayout extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      'board-context-menu-id': null,
    };

    this.refs = {
      'board-context-menu': null,
    };
  }
  render() {
    return (
      <div>
        <SidebarLayout
          { ...this.props }
          changeBoard={ this.changeBoard.bind(this) }
          openBoardContextMenu={ this.openBoardContextMenu.bind(this) } />
        <Board
          boards = { this.props.boards } /* necessary for the api (team data) */
          users = { this.props.team.users }
          board={ this.props.board }
          moduleInstances={ this.props.moduleInstances }
          getMessages={ this.props.getMessages } />
        <div className='chats-container'>
          { this.renderChats() }
        </div>
        {
          this.props.owner ? (
            <div className='board-context-menu' ref='board-context-menu'>
              <div className='row' onClick={ this.removeBoard.bind(this) }>
            		<div className='col-xs-4'>
            			<img src='http://image0.flaticon.com/icons/svg/60/60761.svg' width='20px' />
          	  	</div>
          	  	<p className='col-xs-8'>Eliminar</p>
            	</div>
            </div>
          ) : ( null )
        }

      </div>
    );
  }
  componentDidMount() {
    if(this.props.owner) {
      let self = this;
      $(document).bind('mousedown', (e) => {
        if(!$(e.target).parents('.board-context-menu').length > 0) {
          self.closeBoardContextMenu();
        }
      });
    }
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

  // context-menu
  openBoardContextMenu(boardId, event) {
    if(this.props.owner) {
      event.persist();

      $(this.refs['board-context-menu'])
        .finish()
        .toggle(100)
        .css({
          top: event.pageY + 'px',
          left: event.pageX + 10 + 'px',
        });

      this.setState({
        'board-context-menu-id': boardId,
      });
    }
  }
  closeBoardContextMenu() {
    $(this.refs['board-context-menu']).hide(100);
  }

  // boards
  changeBoard(boardId) {
    if(boardId !== this.props.board._id) {
      let board = this.props.boards.find((board) => {
        return board._id === boardId;
      });

      this.props.boardSubscribe(board._id);
    }
  }
  removeBoard() {
    if(this.props.owner) {
      let boardId = this.state['board-context-menu-id'];
      Meteor.call('Boards.methods.archiveBoard', { _id: boardId }, (error, result) => {
        if(error) {
          throw new Meteor.Error(error);
        } else {
          let newBoardId;
          this.props.boards.map((board) => {
            if(board._id !== boardId) {
              newBoardId = board._id;
            }
          });

          this.props.removeChat({ boardId }); // Remove board chats with this boardId
          this.changeBoard(newBoardId); // Change to another board which isn't this one
          this.closeBoardContextMenu(); // Close menu
        }
      });
    }
  }
}

TeamLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  owner: React.PropTypes.bool.isRequired,

  boards: React.PropTypes.array.isRequired,
  board: React.PropTypes.object.isRequired,
  moduleInstances: React.PropTypes.array,
  modules: React.PropTypes.array.isRequired,

  directChats: React.PropTypes.array.isRequired,
  chats: React.PropTypes.array.isRequired,

  getMessages: React.PropTypes.func.isRequired,
  removeChat: React.PropTypes.func.isRequired,
  boardSubscribe: React.PropTypes.func.isRequired,
};
