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
  }
  render() {
    return (
      <div>
        <SidebarLayout
          { ...this.props }
          changeBoard={ this.changeBoard.bind(this) }
          openContextMenu={ this.openContextMenu.bind(this) } />
        <Board
          board={ this.props.board }
          moduleInstances={ this.props.moduleInstances }
          users={ this.props.team.users }
          getMessages={ this.props.getMessages } />
        <div className='chats-container'>
          { this.renderChats() }
        </div>
        { 
          this.props.owner ? (
            <div className='board-context-menu'>
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
    if(this.props.owner) { // fix this fucking shit
      $(document).bind('mousedown', function (e) {
        if(!$(e.target).parents('.board-context-menu').length > 0) {
          $('.board-context-menu').hide(100);
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
  changeBoard(boardId) {
    if(boardId !== this.props.board._id) {
      let board = this.props.boards.find((board) => {
        return board._id === boardId;
      });

      this.props.boardSubscribe(board._id);
    }
  }
  
  openContextMenu(boardId, e) {
    if(this.props.owner) {
      e.persist();

      $('.board-context-menu')
        .finish()
        .toggle(100)
        .css({
          top: e.pageY + 'px',
          left: e.pageX + 10 + 'px',
        });

      this.setState({
        'board-context-menu-id': boardId,
      });
    }
  }
  removeBoard() {
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
        
        this.changeBoard(newBoardId); // Change to another board which isn't this one
        this.props.removeChat({ boardId }); // Remove board chats with this boardId
        $('.board-context-menu').toggle(100);
      }
    });
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
