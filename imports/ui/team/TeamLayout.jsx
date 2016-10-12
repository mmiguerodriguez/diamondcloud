import { Meteor }                   from 'meteor/meteor';
import { Teams }                    from '../../api/teams/teams.js';
import { Boards }                   from '../../api/boards/boards.js';
import { DirectChats }              from '../../api/direct-chats/direct-chats.js';

import React                        from 'react';
import { Link }                     from 'react-router';
import classNames                   from 'classnames';
import isMobile                     from 'ismobilejs';

import Board                        from './board/Board.jsx';
import ChatLayout                   from './chat/ChatLayout.jsx';
import SidebarLayout                from './sidebar/SidebarLayout.jsx';
import NotificationsPermissionAsker from './notifications-permission-asker/NotificationsPermissionAsker.jsx';
import CreateBoardModal             from '../modals/create-board/CreateBoardModal.jsx';
import CreateChatModal              from '../modals/create-chat/CreateChatModal.jsx';
import ConfigTeamModal              from '../modals/config-team/ConfigTeamModal.jsx';

export default class TeamLayout extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      'board-context-menu-id': null,
      'moduleinstance-context-menu-id': null,
      'moduleinstance-iframe': null,
      'permissionAsker': !isMobile.any ? Notification.permission === 'default' : false,
      'has-maximized-chats': false,
    };

    this.refs = {
      'board-context-menu': null,
      'moduleinstance-context-menu': null,
    };

    this.removeBoard = this.removeBoard.bind(this);
    this.changeBoard = this.changeBoard.bind(this);
    this.removeModuleInstance = this.removeModuleInstance.bind(this);
    this.openCreateBoardModal = this.openCreateBoardModal.bind(this);
    this.openCreateChatModal = this.openCreateChatModal.bind(this);
    this.openConfigTeamModal = this.openConfigTeamModal.bind(this);
    this.loadTeam = this.loadTeam.bind(this);
    this.toggleCollapsible = this.toggleCollapsible.bind(this);
    this.closePermissionAsker = this.closePermissionAsker.bind(this);
    this.openModuleInstanceContextMenu = this.openModuleInstanceContextMenu.bind(this);
    this.openBoardContextMenu = this.openBoardContextMenu.bind(this);
  }
  render() {
    let chatsContainer = classNames({
      'auto': !this.state['has-maximized-chats'],
      'maximized': this.state['has-maximized-chats'],
      'mobile': isMobile.any,
      'hidden': this.props.chats.length === 0,
    }, 'chats-container');

    return (
      <div>
        {
          !isMobile.any ? (
            <div>
              {
                this.state.permissionAsker ? (
                  <NotificationsPermissionAsker close={ this.closePermissionAsker } />
                ) : ( null )
              }
              <SidebarLayout
                { ...this.props }
                addChat={ this.props.addChat }
                changeBoard={ this.changeBoard }
                permissionAsker={ this.state.permissionAsker }
                openBoardContextMenu={ this.openBoardContextMenu }
                toggleCollapsible={ this.toggleCollapsible }
                openCreateBoardModal={ this.openCreateBoardModal }
                openCreateChatModal={ this.openCreateChatModal }
                openConfigTeamModal={ this.openConfigTeamModal } />
              <Board
                team={ this.props.team }
                boards={ this.props.boards }
                board={ this.props.board }
                users={ this.props.users }
                moduleInstances={ this.props.moduleInstances }
                moduleInstancesFrames={ this.props.moduleInstancesFrames }
                modules={ this.props.modules }
                addChat={ this.props.addChat }
                openModuleInstanceContextMenu={ this.openModuleInstanceContextMenu }
                permissionAsker={ this.state.permissionAsker } />
            </div>
          ) : (
            <div>
              <div className='dropdown'>
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
              <div className='tabs'>
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
              <div className='chats'>
              <div className='boards active' id='boards'>
                { this.renderBoardsChats() }
                {
                  this.props.isAdmin ? (
                    <div
                      className='new-chat visible-xs-block'
                      role='button'
                      onClick={ this.openCreateBoardModal }>
                      <img className='icon boards active' src='/img/sidebar/messages.svg' width='26px' />
                    </div>
                  ) : ( null )
                }
              </div>
              <div className='users' id='users'>
                { this.renderDirectChats() }
                <div
                  className='new-chat visible-xs-block'
                  onClick={ this.openCreateChatModal }>
                  <img className='icon users' src='/img/add-people-icon.svg' width='26px' />
                </div>
              </div>
            </div>
            </div>
          )
        }

        <div className={ chatsContainer }>
          { this.renderChats() }
        </div>

        <div className='moduleinstance-context-menu context-menu' ref='moduleinstance-context-menu'>
          <div className='row' onClick={ this.removeModuleInstance }>
            <div className='col-xs-4'>
              <img src='http://image0.flaticon.com/icons/svg/60/60761.svg' width='20px' />
            </div>
            <p className='col-xs-8'>Eliminar</p>
          </div>
        </div>

        {
          this.props.isAdmin ? (
            <div>
              <div className='board-context-menu context-menu' ref='board-context-menu'>
                <div className='row' onClick={ this.removeBoard }>
              		<div className='col-xs-4'>
              			<img src='http://image0.flaticon.com/icons/svg/60/60761.svg' width='20px' />
            	  	</div>
            	  	<p className='col-xs-8'>Eliminar</p>
              	</div>
              </div>
              <CreateBoardModal
                team={ this.props.team }
                addChat={ this.props.addChat }
                changeBoard={ this.changeBoard }
                toggleCollapsible={ this.toggleCollapsible } />
              <ConfigTeamModal
                key={ this.props.team._id }
                team={ this.props.team }
                loadTeam={ this.loadTeam } />
            </div>
          ) : ( null )
        }
        <CreateChatModal
          team={ this.props.team }
          addChat={ this.props.addChat }
          toggleCollapsible={ this.toggleCollapsible } />
      </div>
    );
  }

  componentDidMount() {
    let self = this;
    if (this.props.isAdmin) {
      $(document).bind('mousedown', (e) => {
        if (!$(e.target).parents('.board-context-menu').length > 0) {
          self.closeContextMenu(this.refs['board-context-menu']);
        }
      });
    }

    $(document).bind('mousedown', (e) => {
      if (!$(e.target).parents('.moduleinstance-context-menu').length > 0) {
        self.closeContextMenu(this.refs['moduleinstance-context-menu']);
      }
    });
  }

  // chats
  renderChats() {
    return this.props.chats.map((chat) => {
      return (
        <ChatLayout
          key={ chat.directChatId || chat.boardId }
          chat={ chat }
          users={ this.props.team.users }
          boards={ this.props.boards }
          directChats={ this.props.directChats }
          position={ isMobile.any ? 'mobile' : 'medium' }
          togglePosition={ this.togglePosition }
          removeChat={ this.props.removeChat }
          hasMaximizedChats={ this.state['has-maximized-chats']} />
      );
    });
  }
  togglePosition(chat, oldPosition, newPosition) {
    chat.setState({
      position: newPosition,
    }, () => {
      if (newPosition === 'maximized' || oldPosition === 'maximized') {
        this.setState({
          'has-maximized-chats': !this.state['has-maximized-chats'],
        });
      }
    });
  }

  // minimized
  renderTeams() {
    let arr = [];

    this.props.teams.map((team) => {
      if (this.props.team._id !== team._id) {
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
    return this.props.directChats.map((_directChat) => {
      let directChat = DirectChats.findOne(_directChat._id);

      let lastMessage = directChat.getLastMessage();
      let user = directChat.getUser();
      let notifications = directChat.getNotifications();

      let infoClasses = classNames({
        'col-xs-8': notifications > 0,
        'col-xs-10': notifications === 0,
      }, 'info');

      return (
        <div
          className='item'
          role='button'
          onClick={ this.props.addChat.bind(null, { directChatId: directChat._id }) }
          key={ directChat._id }>
          <div className='col-xs-2'>
            <img
              className='img-circle'
              src={ user.profile.picture }
              width='48px' />
          </div>
          <div className={ infoClasses }>
            <p className='user truncate'>{ user.profile.name }</p>
            <p className='last-message truncate'>{ lastMessage.content }</p>
          </div>
          {
            notifications > 0 ? (
              <div className='col-xs-2'>
                <div className='pin'>
                  <p className='text'>{ notifications }</p>
                </div>
              </div>
            ) : ( null )
          }
        </div>
      );
    });
  }
  renderBoardsChats() {
    return this.props.boards.map((_board) => {
      let board = Boards.findOne(_board._id);

      let lastMessage = board.getLastMessage();
      let notifications = board.getNotifications();

      let infoClasses = classNames({
        'col-xs-8': notifications > 0,
        'col-xs-10': notifications === 0,
      }, 'info');

      return (
        <div
          className='item'
          role='button'
          onClick={ this.props.addChat.bind(null, { boardId: board._id }) }
          key={ board._id }>
          <div className='col-xs-2'>
            <img
              className='img-circle'
              src='http://image.flaticon.com/icons/svg/60/60541.svg'
              width='48px' />
          </div>
          <div className={ infoClasses }>
            <p className='user truncate'>{ board.name }</p>
            <p className='last-message truncate'>
              {
                lastMessage.content !== '' ? (
                  Meteor.users.findOne(lastMessage.senderId).profile.name + ': ' + lastMessage.content
                ) : ( lastMessage.content )
              }
            </p>
          </div>
          {
            notifications > 0 ? (
              <div className='col-xs-2'>
                <div className='pin'>
                  <p className='text'>{ notifications }</p>
                </div>
              </div>
            ) : ( null )
          }
        </div>
      );
    });
  }

  // boards
  changeBoard(boardId) {
    this.props.boardSubscribe(boardId);
  }
  removeBoard() {
    if (this.props.isAdmin) {
      let boardId = this.state['board-context-menu-id'];

      Meteor.call('Boards.methods.archiveBoard', { _id: boardId }, (error, result) => {
        if (error) {
          console.error(error);
        } else {
          let newBoardId;
          this.props.boards.map((board) => {
            if (board._id !== boardId) {
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
    if (this.props.isAdmin) {
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
      if (error) {
        console.error(error);
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

  // collapsibles
  toggleCollapsible(name) {
    let elem = name + '-' + 'collapsible';
    let active = this.checkActive(elem);

    this.hideAllActiveBackgrounds();

    if (active) {
      this.hideActive();
      this.toggleSubHeader();
    } else {
      this.hideActive(() => {
        let collapsible = $('#' + elem);
        this.effect(collapsible, 'slide', 'left', 'show', 350);

        let item = $('#' + name + '-' + 'item');
        this.showBackground(item);
      });
    }
  }
  checkActive(name) {
    let result;
    $('.collapsible').each((index, item) => {
      let elem = $(item);

      if (elem.css('display') === 'block')  {
        let id = elem.attr('id');
        if (name === id) {
          result = true;
        }
      }
    });
    return result || false;
  }
  hideActive(callback) {
    let activeElement;
    $('.collapsible').each((index, item) => {
      let elem = $(item);

      if (elem.css('display') === 'block') {
        activeElement = elem;
      }
    });

    if (!!activeElement) {
      this.effect(activeElement, 'slide', 'left', 'hide', 350, callback);
    } else {
      callback();
      this.toggleSubHeader();
    }
  }
  // items
  showBackground(elem) {
    let img = elem.children('img');

    img.addClass('filter');
    elem.addClass('active');
  }
  hideBackground(elem) {
    let img = elem.children('img');

    img.removeClass('filter');
    elem.removeClass('active');
  }
  hideAllActiveBackgrounds() {
    $('.item').each((index, item) => {
      let elem = $(item);

      if (!elem.hasClass('bottom')){
        if (elem.css('backgroundColor') === 'rgb(255, 255, 255)'){
          this.hideBackground(elem);
        }
      }
    });
  }
  // helpers
  effect(element, type, direction, mode, time, callback) {
    element.effect(type, {
      direction,
      mode,
    }, time, callback);
  }
  toggleSubHeader() {
    $('.sub-header').toggleClass('sub-header-collapsed');
  }

  openCreateBoardModal() {
    $('#createBoardModal').modal('show');
  }
  openCreateChatModal() {
    $('#createChatModal').modal('show');
  }
  openConfigTeamModal() {
    this.loadTeam(this.props.team._id, () => {
      $('#configTeamModal').modal('show');//show modal once state is updated
    });
  }
  loadTeam(id, callback) {
    this.setState({
      team: Teams.findOne(id),
    }, callback);
  }
}

TeamLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
  team: React.PropTypes.object.isRequired,
  isAdmin: React.PropTypes.bool.isRequired,

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
