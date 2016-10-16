import { Meteor }                   from 'meteor/meteor';
import { Teams }                    from '../../api/teams/teams';
import { Boards }                   from '../../api/boards/boards';
import { DirectChats }              from '../../api/direct-chats/direct-chats';

import React                        from 'react';
import { Link }                     from 'react-router';
import classNames                   from 'classnames';
import isMobile                     from 'ismobilejs';

import Board                        from './board/Board';
import ChatLayout                   from './chat/ChatLayout';
import SidebarLayout                from './sidebar/SidebarLayout';
import NotificationsPermissionAsker from './notifications-permission-asker/NotificationsPermissionAsker';
import CreateBoardModal             from '../modals/create-board/CreateBoardModal';
import CreateChatModal              from '../modals/create-chat/CreateChatModal';
import ConfigTeamModal              from '../modals/config-team/ConfigTeamModal';
import ConfigBoardModal             from '../modals/config-board/ConfigBoardModal';

export default class TeamLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'board-context-menu-id': null,
      'moduleinstance-context-menu-id': null,
      'moduleinstance-iframe': null,
      'has-maximized-chats': false,
      permissionAsker: !isMobile.any ? Notification.permission === 'default' : false,
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
    this.openConfigBoardModal = this.openConfigBoardModal.bind(this);
    this.loadTeam = this.loadTeam.bind(this);
    this.toggleCollapsible = this.toggleCollapsible.bind(this);
    this.closePermissionAsker = this.closePermissionAsker.bind(this);
    this.openModuleInstanceContextMenu = this.openModuleInstanceContextMenu.bind(this);
    this.openBoardContextMenu = this.openBoardContextMenu.bind(this);
  }

  componentDidMount() {
    const self = this;

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

    if (this.props.team.users.length === 1) {
      this.openConfigTeamModal();
    }
  }
  // chats
  renderChats() {
    return this.props.chats.map((chat) =>
      <ChatLayout
        key={chat.directChatId || chat.boardId}
        chat={chat}
        users={this.props.team.users}
        boards={this.props.boards}
        directChats={this.props.directChats}
        position={isMobile.any ? 'mobile' : 'medium'}
        togglePosition={this.togglePosition}
        removeChat={this.props.removeChat}
        hasMaximizedChats={this.state['has-maximized-chats']}
        toggleError={this.props.toggleError}
      />
    );
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
    const arr = [];

    this.props.teams.forEach((team) => {
      if (this.props.team._id !== team._id) {
        arr.push(
          <li key={ team._id } className='item-li'>
            <Link to={ '/team/' + team.url } className='item-a truncate'>{ team.name }</Link>
          </li>
        );
      }
    });

    return arr;
  }

  renderDirectChats() {
    return this.props.directChats.map((_directChat) => {
      const directChat = DirectChats.findOne(_directChat._id);

      const lastMessage = directChat.getLastMessage();
      const user = directChat.getUser();
      const notifications = directChat.getNotifications();

      const infoClasses = classNames({
        'col-xs-8': notifications > 0,
        'col-xs-10': notifications === 0,
      }, 'info');

      return (
        <div
          className="item"
          role="button"
          onClick={this.props.addChat.bind(null, { directChatId: directChat._id })}
          key={directChat._id}
        >
          <div className="col-xs-2">
            <img
              className="img-circle"
              src={user.profile.picture}
              width="48px"
            />
          </div>
          <div className={infoClasses}>
            <p className="user truncate">{user.profile.name}</p>
            <p className="last-message truncate">{lastMessage.content}</p>
          </div>
          {
            notifications > 0 ? (
              <div className="col-xs-2">
                <div className="pin">
                  <p className="text">{notifications}</p>
                </div>
              </div>
            ) : (null)
          }
        </div>
      );
    });
  }

  renderBoardsChats() {
    return this.props.boards.map((_board) => {
      const board = Boards.findOne(_board._id);

      const lastMessage = board.getLastMessage();
      const notifications = board.getNotifications();

      const infoClasses = classNames({
        'col-xs-8': notifications > 0,
        'col-xs-10': notifications === 0,
      }, 'info');

      return (
        <div
          className="item"
          role="button"
          onClick={this.props.addChat.bind(null, { boardId: board._id })}
          key={board._id}
        >
          <div className="col-xs-2">
            <img
              className="img-circle"
              src="http://image.flaticon.com/icons/svg/60/60541.svg"
              width="48px"
            />
          </div>
          <div className={infoClasses}>
            <p className="user truncate">{board.name}</p>
            <p className="last-message truncate">
              {
                lastMessage.content !== '' ? (
                  Meteor.users.findOne(lastMessage.senderId).profile.name + ': ' + lastMessage.content
                ) : (lastMessage.content)
              }
            </p>
          </div>
          {
            notifications > 0 ? (
              <div className="col-xs-2">
                <div className="pin">
                  <p className="text">{notifications}</p>
                </div>
              </div>
            ) : (null)
          }
        </div>
      );
    });
  }

  render() {
    const chatsContainer = classNames({
      auto: !this.state['has-maximized-chats'],
      maximized: this.state['has-maximized-chats'],
      mobile: isMobile.any,
      hidden: this.props.chats.length === 0,
    }, 'chats-container');

    return (
      <div>
        {
          !isMobile.any ? (
            <div>
              {
                this.state.permissionAsker ? (
                  <NotificationsPermissionAsker close={this.closePermissionAsker} />
                ) : (null)
              }
              <SidebarLayout
                {...this.props}
                changeBoard={this.changeBoard}
                permissionAsker={this.state.permissionAsker}
                openBoardContextMenu={this.openBoardContextMenu}
                toggleCollapsible={this.toggleCollapsible}
                openCreateBoardModal={this.openCreateBoardModal}
                openCreateChatModal={this.openCreateChatModal}
                openConfigTeamModal={this.openConfigTeamModal}
              />
              <Board
                team={this.props.team}
                boards={this.props.boards}
                board={this.props.board}
                users={this.props.users}
                moduleInstances={this.props.moduleInstances}
                moduleInstancesFrames={this.props.moduleInstancesFrames}
                modules={this.props.modules}
                addChat={this.props.addChat}
                openModuleInstanceContextMenu={this.openModuleInstanceContextMenu}
                permissionAsker={this.state.permissionAsker}
                toggleError={this.props.toggleError}
              />
            </div>
          ) : (
            <div>
              <div className="dropdown">
                <button
                  className="btn col-xs-12"
                  id="dLabel"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.props.team.name}
                  <span className="caret" />
                </button>
                <ul className="dropdown-menu col-xs-12" aria-labelledby="dLabel">
                  {this.renderTeams()}
                </ul>
              </div>
              <div className="tabs">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="item col-xs-6 active">
                    <a
                      href="#boards"
                      aria-controls="boards"
                      role="tab"
                      data-toggle="tab"
                      aria-expanded="false"
                    >
                      Boards
                    </a>
                  </li>
                  <li className="item col-xs-6">
                    <a
                      href="#users"
                      aria-controls="users"
                      role="tab"
                      data-toggle="tab"
                      aria-expanded="true"
                    >
                      Users
                    </a>
                  </li>
                </ul>
              </div>
              <div className="chats">
                <div className="boards active" id="boards">
                  {this.renderBoardsChats()}
                  {
                    this.props.isAdmin ? (
                      <div
                        className="new-chat visible-xs-block"
                        onClick={this.openCreateBoardModal}
                      >
                        <img
                          className="icon boards active"
                          src="/img/sidebar/messages.svg"
                          width="26px"
                        />
                      </div>
                    ) : (null)
                  }
                </div>
                <div className="users" id="users">
                  {this.renderDirectChats()}
                  <div
                    className="new-chat visible-xs-block"
                    onClick={this.openCreateChatModal}
                  >
                    <img
                      className="icon users"
                      src="/img/add-people-icon.svg"
                      width="26px"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }

        <div className={chatsContainer}>
          {this.renderChats()}
        </div>

        <div className="moduleinstance-context-menu context-menu" ref="moduleinstance-context-menu">
          <div className="row" onClick={this.removeModuleInstance}>
            <div className="col-xs-4">
              <img src="http://image0.flaticon.com/icons/svg/60/60761.svg" width="20px" />
            </div>
            <p className="col-xs-8">Eliminar</p>
          </div>
        </div>

        {
          this.props.isAdmin ? (
            <div>
              <div className="board-context-menu context-menu" ref="board-context-menu">
                <div className="row" onClick={this.openConfigBoardModal}>
                  <div className="col-xs-4">
                    <img src="/img/teamconfig.svg" width="20px" />
                  </div>
                  <div className="col-xs-8">Editar</div>
                </div>
                <div className="row" onClick={this.removeBoard}>
                  <div className="col-xs-4">
                    <img src="http://image0.flaticon.com/icons/svg/60/60761.svg" width="20px" />
                  </div>
                  <p className="col-xs-8">Eliminar</p>
                </div>
              </div>
              <CreateBoardModal
                team={this.props.team}
                addChat={this.props.addChat}
                changeBoard={this.changeBoard}
                toggleCollapsible={this.toggleCollapsible}
              />
              <ConfigTeamModal
                key={this.props.team._id}
                team={this.props.team}
                loadTeam={this.loadTeam}
              />
              {
                this.state['board-context-menu-id'] ? (
                  <ConfigBoardModal
                    team={this.props.team}
                    boards={this.props.boards}
                    boardId={this.state['board-context-menu-id']}
                  />
                ) : (null)
              }
            </div>
          ) : (null)
        }
        <CreateChatModal
          team={this.props.team}
          addChat={this.props.addChat}
          toggleCollapsible={this.toggleCollapsible}
        />
      </div>
    );
  }
  // boards
  changeBoard(boardId) {
    this.props.boardSubscribe(boardId);
  }

  removeBoard() {
    if (this.props.isAdmin) {
      const boardId = this.state['board-context-menu-id'];

      Meteor.call('Boards.methods.archiveBoard', { _id: boardId }, (error, result) => {
        if (error) {
          this.props.toggleError({
            type: 'show',
            body: 'Hubo un error al eliminar el board',
          });
        } else {
          let newBoardId;
          this.props.boards.forEach((board) => {
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
    const self = this;

    const moduleInstanceId = this.state['moduleinstance-context-menu-id'];
    const contextMenu = this.refs['moduleinstance-context-menu'];
    const iframe = this.state['moduleinstance-iframe'];

    Meteor.call('ModuleInstances.methods.archive', { moduleInstanceId }, (error, result) => {
      if (error) {
        self.props.toggleError({
          type: 'show',
          body: 'Hubo un error al eliminar el módulo',
        });
      } else {
        iframe.contentWindow.DiamondAPI.unsubscribe();
        self.closeContextMenu(contextMenu);
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
      permissionAsker: false,
    });
  }
  // collapsibles
  toggleCollapsible(name) {
    const elem = name + '-' + 'collapsible';
    const active = this.checkActive(elem);

    this.hideAllActiveBackgrounds();

    if (active) {
      this.hideActive();
      this.toggleSubHeader();
    } else {
      this.hideActive(() => {
        const collapsible = $('#' + elem);
        this.effect(collapsible, 'slide', 'left', 'show', 350);

        const item = $('#' + name + '-' + 'item');
        this.showBackground(item);
      });
    }
  }

  checkActive(name) {
    let result;
    $('.collapsible').each((index, item) => {
      const elem = $(item);

      if (elem.css('display') === 'block') {
        const id = elem.attr('id');
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
      const elem = $(item);

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
    const img = elem.children('img');

    img.addClass('filter');
    elem.addClass('active');
  }

  hideBackground(elem) {
    const img = elem.children('img');

    img.removeClass('filter');
    elem.removeClass('active');
  }

  hideAllActiveBackgrounds() {
    $('.item').each((index, item) => {
      const elem = $(item);

      if (!elem.hasClass('bottom')) {
        if (elem.css('backgroundColor') === 'rgb(255, 255, 255)') {
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

  openConfigBoardModal() {
    $('#configBoardModal').modal('show');
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
  toggleError: React.PropTypes.func.isRequired,
};
