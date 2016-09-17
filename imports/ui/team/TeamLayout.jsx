import React            from 'react';
import { Link }         from 'react-router';
import classNames       from 'classnames';

import Board                        from './board/Board.jsx';
import ChatLayout                   from './chat/ChatLayout.jsx';
import SidebarLayout                from './sidebar/SidebarLayout.jsx';
import NotificationsPermissionAsker from './notifications-permission-asker/NotificationsPermissionAsker.jsx';

export default class TeamLayout extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      'board-context-menu-id': null,
      'moduleinstance-context-menu-id': null,
      'moduleinstance-iframe': null,
      'permissionAsker': Notification.permission === 'default',
      'has-maximized-chats': false,
    };

    this.refs = {
      'board-context-menu': null,
      'moduleinstance-context-menu': null,
    };
  }
  render() {
    let chatsContainer = classNames({
      'auto': !this.state['has-maximized-chats'],
      'maximized': this.state['has-maximized-chats'],
    }, 'chats-container');

    return (
      <div>
        {
          this.state.permissionAsker ?
            (<NotificationsPermissionAsker
              close={ this.closePermissionAsker.bind(this) }/>) : ( null )
        }
        <SidebarLayout
          { ...this.props }
          permissionAsker={ this.state.permissionAsker }
          changeBoard={ this.changeBoard.bind(this) }
          openBoardContextMenu={ this.openBoardContextMenu.bind(this) }
          addChat={ this.props.addChat }/>
        <Board
          boards={ this.props.boards }
          board={ this.props.board }
          users={ this.props.team.users }
          moduleInstances={ this.props.moduleInstances }
          moduleInstancesFrames={ this.props.moduleInstancesFrames }
          modules={ this.props.modules }
          addChat={ this.props.addChat }
          openModuleInstanceContextMenu={ this.openModuleInstanceContextMenu.bind(this) }
          permissionAsker={ this.state.permissionAsker } />
        <div className={ chatsContainer }>
          { this.renderChats() }
        </div>

        <div className='dropdown visible-xs-block'>
          <button className='btn col-xs-12'
                  id='dLabel'
                  type='button'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'>
            { this.props.team.name }
            <span className='caret'></span>
          </button>
          <ul className='dropdown-menu col-xs-12' aria-labelledby='dLabel'>
            { this.renderTeams() }
          </ul>
        </div>
        <div className='tabs visible-xs-block'>
            <ul className='nav nav-tabs' role='tablist'>
              <li className='item col-xs-6 active'>
                <a href='#boards' aria-controls='boards' role='tab' data-toggle='tab' aria-expanded='false'>
                  Boards
                </a>
              </li>
              <li className='item col-xs-6'>
                <a href='#users' aria-controls='users' role='tab' data-toggle='tab' aria-expanded='true'>
                  Users
                </a>
              </li>
            </ul>
        </div>
        <div className='chats visible-xs-block'>
          <div className='boards active' id='boards'>
            { this.renderBoardsChats() }
            <div className='new-chat visible-xs-block'>
              <img className='icon boards active' src='/img/sidebar/messages.svg' width='26px' />
            </div>
          </div>
          <div className='users' id='users'>
            { this.renderDirectChats() }
            <div className='new-chat visible-xs-block'>
              <img className='icon users' src='/img/add-people-icon.svg' width='26px' />
            </div>
          </div>
        </div>

        <div className='moduleinstance-context-menu context-menu' ref='moduleinstance-context-menu'>
          <div className='row' onClick={ this.removeModuleInstance.bind(this) }>
            <div className='col-xs-4'>
              <img src='http://image0.flaticon.com/icons/svg/60/60761.svg' width='20px' />
            </div>
            <p className='col-xs-8'>Eliminar</p>
          </div>
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

  // chats
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
          togglePosition={ this.togglePosition.bind(this) }
          removeChat={ this.props.removeChat }
          hasMaximizedChats={ this.state['has-maximized-chats']}/>
      );
    });

    return arr;
  }
  
  togglePosition(chat, oldPosition, newPosition) {
    chat.setState({
      position: newPosition,
    }, () => {
      if(newPosition === 'maximized' || oldPosition === 'maximized') {
        this.setState({
          'has-maximized-chats': !this.state['has-maximized-chats'],
        });
      }
    });
  }

  // Minimized
  renderTeams() {
    let arr = [];

    this.props.teams.map((team) => {
      if(this.props.team._id !== team._id) {
        arr.push(
          <li key={ team._id } className='item-li'>
            <Link to={ '/team/' + team._id } className='item-a truncate'>{ team.name }</Link>
          </li>
        );
      }
    });

    return arr;
  }
  renderDirectChats() {
    let arr = [];

    this.props.directChats.map((directChat) => {
      let user = this.getUser(directChat._id);

      arr.push(
        <div className='item' role='button' key={ directChat._id }>
          <div className='col-xs-2'>
            <img
              className='img-circle'
              src={ user.profile.picture }
              width='48px' />
          </div>
          <div className='col-xs-8 info'>
            <p className='user truncate'>{ user.profile.name }</p>
            <p className='last-message truncate'>{ 'last message' }</p>
          </div>
          <div className='col-xs-2'>
            <div className='pin'>
              <p className='text'>12</p>
            </div>
          </div>
        </div>
      );
    });

    return arr;
  }
  renderBoardsChats() {
    let arr = [];

    this.props.boards.map((board) => {
      arr.push(
        <div className='item' role='button' key={ board._id }>
          <div className='col-xs-2'>
            <img
              className='img-circle'
              src='http://image.flaticon.com/icons/svg/60/60541.svg'
              width='48px' />
          </div>
          <div className='col-xs-8 info'>
            <p className='user truncate'>{ board.name }</p>
            <p className='last-message truncate'>{ 'last message' }</p>
          </div>
          <div className='col-xs-2'>
            <div className='pin'>
              <p className='text'>12</p>
            </div>
          </div>
        </div>
      );
    });

    return arr;
  }
  // Helpers
  getUser(directChatId) {
    let user;

    let directChat = this.props.directChats.find((_directChat) => {
      return _directChat._id === directChatId;
    });
    directChat.users.map((_user) => {
      if(_user._id !== Meteor.userId()) {
        user = Meteor.users.findOne(_user._id);
      }
    });

    return user;
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

  closePermissionAsker() {
    this.setState({
      permissionAsker: false
    });
  }
}

TeamLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
  team: React.PropTypes.object.isRequired,
  owner: React.PropTypes.bool.isRequired,

  boards: React.PropTypes.array.isRequired,
  board: React.PropTypes.object.isRequired,

  moduleInstances: React.PropTypes.array,
  moduleInstancesFrames: React.PropTypes.array,
  modules: React.PropTypes.array.isRequired,

  directChats: React.PropTypes.array.isRequired,
  chats: React.PropTypes.array.isRequired,

  addChat: React.PropTypes.func.isRequired,
  removeChat: React.PropTypes.func.isRequired,
  boardSubscribe: React.PropTypes.func.isRequired,
};
