import React            from 'react';

import Board            from './board/Board.jsx';
import ChatLayout       from './chat/ChatLayout.jsx';
import SidebarLayout    from './sidebar/SidebarLayout.jsx';

export default class TeamLayout extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      'board-context-menu-id': null,
      'moduleinstance-context-menu-id': null,
      'moduleinstance-iframe': null,
    };

    this.refs = {
      'board-context-menu': null,
      'moduleinstance-context-menu': null,
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
          boards={ this.props.boards }
          board={ this.props.board }
          users={ this.props.team.users }
          moduleInstances={ this.props.moduleInstances }
          moduleInstancesFrames={ this.props.moduleInstancesFrames }
          modules={ this.props.modules }
          getMessages={ this.props.getMessages }
          openModuleInstanceContextMenu={ this.openModuleInstanceContextMenu.bind(this) } />
        <div className='chats-container'>
          { this.renderChats() }
        </div>
        {
          this.props.owner ? (
            <div className='board-context-menu context-menu' ref='board-context-menu'>
              <div className='row' onClick={ this.removeBoard.bind(this) }>
            		<div className='col-xs-4'>
            			<img src='http://image0.flaticon.com/icons/svg/60/60761.svg' width='20px' />
          	  	</div>
          	  	<p className='col-xs-8'>Eliminar</p>
            	</div>
            </div>
          ) : ( null )
        }
        <div className='moduleinstance-context-menu context-menu' ref='moduleinstance-context-menu'>
          <div className='row' onClick={ this.removeModuleInstance.bind(this) }>
            <div className='col-xs-4'>
              <img src='http://image0.flaticon.com/icons/svg/60/60761.svg' width='20px' />
            </div>
            <p className='col-xs-8'>Eliminar</p>
          </div>
        </div>
        <div className="new-chat visible-xs-block">
          <img className="icon" src="/img/add-people-icon.svg" width="32px" />
        </div>
      </div>
    );
  }
  componentDidMount() {
    let self = this;
    if(this.props.owner) {
      $(document).bind('mousedown', (e) => {
        if(!$(e.target).parents('.board-context-menu').length > 0) {
          self.closeContextMenu(this.refs['board-context-menu']);
        }
      });
    }

    $(document).bind('mousedown', (e) => {
      if(!$(e.target).parents('.moduleinstance-context-menu').length > 0) {
        self.closeContextMenu(this.refs['moduleinstance-context-menu']);
      }
    });
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

          this.closeContextMenu(this.refs['board-context-menu']); // Close menu
          this.changeBoard(newBoardId); // Change to another board which isn't this one
          this.props.removeChat({ boardId }); // Remove board chats with this boardId
        }
      });
    }
  }
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

  // module-instances
  removeModuleInstance() {
    let self = this;
    let moduleInstanceId = this.state['moduleinstance-context-menu-id'];
    let contextMenu = this.refs['moduleinstance-context-menu'];
    let iframe = this.state['moduleinstance-iframe'];

    Meteor.call('ModuleInstances.methods.archive', { moduleInstanceId }, (error, result) => {
      if(error) {
        throw new Meteor.Error(error);
      } else {
        iframe.contentWindow.DiamondAPI.unsubscribe();
        self.closeContextMenu(contextMenu);
        console.log(result);
      }
    });
  }
  openModuleInstanceContextMenu(moduleInstanceId, iframe, event) {
    event.preventDefault(); // Prevent normal contextMenu from showing up

    $(this.refs['moduleinstance-context-menu'])
      .finish()
      .toggle(100)
      .css({
        top: event.pageY + 'px',
        left: event.pageX + 'px',
      });

    this.setState({
      'moduleinstance-context-menu-id': moduleInstanceId,
      'moduleinstance-iframe': iframe,
    });
  }

  closeContextMenu(menu) {
    $(menu).hide(100);
  }
}

TeamLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  owner: React.PropTypes.bool.isRequired,

  boards: React.PropTypes.array.isRequired,
  board: React.PropTypes.object.isRequired,

  moduleInstances: React.PropTypes.array,
  moduleInstancesFrames: React.PropTypes.array,
  modules: React.PropTypes.array.isRequired,

  directChats: React.PropTypes.array.isRequired,
  chats: React.PropTypes.array.isRequired,

  getMessages: React.PropTypes.func.isRequired,
  removeChat: React.PropTypes.func.isRequired,
  boardSubscribe: React.PropTypes.func.isRequired,
};
