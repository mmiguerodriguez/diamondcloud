import { Meteor }                   from 'meteor/meteor';

import React                        from 'react';
import { Link }                     from 'react-router';
import classNames                   from 'classnames';
import isMobile                     from 'ismobilejs';

import { Teams }                    from '../../api/teams/teams';
import { Boards }                   from '../../api/boards/boards';
import { DirectChats }              from '../../api/direct-chats/direct-chats';

import Board                        from './board/Board';
import ChatLayout                   from './chat/ChatLayout';
import SidebarLayout                from './sidebar/SidebarLayout';
import NotificationsPermissionAsker from './notifications-permission-asker/NotificationsPermissionAsker';
import CreateBoardModal             from '../modals/create-board/CreateBoardModal';
import ConfigTeamModal              from '../modals/config-team/ConfigTeamModal';
import ConfigBoardModal             from '../modals/config-board/ConfigBoardModal';

export default class TeamLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boardIdContextMenu: null,
      moduleInstanceIdContextMenu: null,
      moduleinstanceIframe: null,
      hasMaximizedChats: false,
      permissionAsker: !isMobile.any ? Notification.permission === 'default' : false,
      togglingCollapsible: false,
    };

    this.refs = {
      'board-context-menu': null,
    };

    this.removeBoard = this.removeBoard.bind(this);
    this.changeBoard = this.changeBoard.bind(this);
    this.removeModuleInstance = this.removeModuleInstance.bind(this);
    this.openCreateBoardModal = this.openCreateBoardModal.bind(this);
    this.openConfigTeamModal = this.openConfigTeamModal.bind(this);
    this.openConfigBoardModal = this.openConfigBoardModal.bind(this);
    this.loadTeam = this.loadTeam.bind(this);
    this.toggleCollapsible = this.toggleCollapsible.bind(this);
    this.closePermissionAsker = this.closePermissionAsker.bind(this);
    this.openModuleInstanceContextMenu = this.openModuleInstanceContextMenu.bind(this);
    this.openBoardContextMenu = this.openBoardContextMenu.bind(this);
    this.createDirectChat = this.createDirectChat.bind(this);
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
        self.closeContextMenu(this.moduleInstanceContextMenu);
      }
    });

    if (this.props.team.users.length === 1) {
      this.openConfigTeamModal();
    }
  }
  // boards
  changeBoard(boardId) {
    this.props.boardSubscribe(boardId);
  }

  removeBoard() {
    if (this.props.isAdmin) {
      const boardId = this.state.boardIdContextMenu;

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
        boardIdContextMenu: boardId,
      });
    }
  }
  // module-instances
  removeModuleInstance() {
    const self = this;

    const moduleInstanceId = this.state.moduleInstanceIdContextMenu;
    const contextMenu = this.moduleInstanceContextMenu;
    const iframe = this.state.moduleinstanceIframe;

    Meteor.call('ModuleInstances.methods.archive', { moduleInstanceId }, (error, result) => {
      if (error) {
        self.props.toggleError({
          type: 'show',
          body: 'Hubo un error al eliminar el módulo',
        });
      } else {
        if (iframe.contentWindow) {
          iframe.contentWindow.DiamondAPI.unsubscribe();
        }

        self.closeContextMenu(contextMenu);
      }
    });
  }

  openModuleInstanceContextMenu(moduleInstanceId, iframe, event) {
    event.preventDefault();

    $(this.moduleInstanceContextMenu)
      .finish()
      .toggle(100)
      .css({
        top: `${event.pageY}px`,
        left: `${event.pageX}px`,
      });

    this.setState({
      moduleInstanceIdContextMenu: moduleInstanceId,
      moduleinstanceIframe: iframe,
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
    if (!this.state.togglingCollapsible) {
      this.setState({
        togglingCollapsible: true,
      }, () => {
        const elem = `${name}-collapsible`;
        const active = this.checkActive(elem);

        this.hideAllActiveBackgrounds();

        if (active) {
          this.toggleSubHeader();
          this.hideActive(() => {
            this.setState({ togglingCollapsible: false });
          });
        } else {
          this.hideActive(() => {
            const collapsible = $(`#${elem}`);
            const item = $(`#${name}-item`);

            this.effect(collapsible, 'slide', 'left', 'show', 350, () => {
              this.setState({ togglingCollapsible: false });
            });
            this.showBackground(item);
          });
        }
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

    if (activeElement) {
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
  // Creates a directChat
  createDirectChat(teamId, userId) {
    const self = this;

    Meteor.call('DirectChats.methods.create', {
      teamId,
      userId,
    }, (error, response) => {
      if (error) {
        self.props.toggleError({
          type: 'show',
          body: 'Hubo un error interno al abrir el mensaje directo',
        });
      } else {
        self.props.addChat({ directChatId: response._id });
      }
    });
  }
  // Mobile dropdown
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
  // Mobile created directChats
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
              src={`${user.profile.picture}?sz=60`}
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
  // Mobile not-created directChats
  renderUsersChat() {
    let arr = [];

    this.props.team.users.forEach((_user) => {
      const user = Meteor.users.findByEmail(_user.email, {});

      if (user._id !== Meteor.userId()) {
        let directChat = DirectChats.getDirectChat(user._id, this.props.team._id);
        if (!directChat) {
          arr.push(
            <div
              className="item"
              role="button"
              onClick={() => this.createDirectChat(this.props.team._id, user._id)}
              key={user._id}
            >
              <div className="col-xs-2">
                <img
                  className="img-circle"
                  src={`${user.profile.picture}?sz=60`}
                  width="48px"
                />
              </div>
              <div className="col-xs-10 info">
                <p className="user truncate">{user.profile.name}</p>
                <p className="last-message truncate"></p>
              </div>
            </div>
          );
        }
      }
    });

    return arr;
  }
  // Mobile board chats
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
              src="/img/board-chat.svg"
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
      auto: !this.state.hasMaximizedChats,
      maximized: this.state.hasMaximizedChats,
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
                openConfigTeamModal={this.openConfigTeamModal}
                createDirectChat={this.createDirectChat}
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
                  {this.renderUsersChat()}
                </div>
              </div>
            </div>
          )
        }

        <ChatLayout
          class={chatsContainer}
          chats={this.props.chats}
          team={this.props.team}
          boards={this.props.boards}
          directChats={this.props.directChats}
          togglePosition={this.props.togglePosition}
          toggleError={this.props.toggleError}
          openHiddenChat={this.props.openHiddenChat}
          removeChat={this.props.removeChat}
          hasMaximizedChats={this.state.hasMaximizedChats}
        />

        <div className="moduleinstance-context-menu context-menu" ref={(c) => { this.moduleInstanceContextMenu = c; }}>
          <div className="row" onClick={this.removeModuleInstance}>
            <div className="col-xs-4">
              <img src="/img/trash.svg" width="20px" />
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
                    <img src="/img/trash.svg" width="20px" />
                  </div>
                  <p className="col-xs-8">Eliminar</p>
                </div>
              </div>
              <CreateBoardModal
                team={this.props.team}
                addChat={this.props.addChat}
                changeBoard={this.changeBoard}
                toggleCollapsible={this.toggleCollapsible}
                toggleError={this.props.toggleError}
              />
              <ConfigTeamModal
                key={this.props.team._id}
                team={this.props.team}
                loadTeam={this.loadTeam}
                toggleError={this.props.toggleError}
              />
              {
                this.state.boardIdContextMenu ? (
                  <ConfigBoardModal
                    team={this.props.team}
                    board={Boards.findOne(this.state.boardIdContextMenu)}
                    toggleError={this.props.toggleError}
                  />
                ) : (null)
              }
            </div>
          ) : (null)
        }
      </div>
    );
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
  openHiddenChat: React.PropTypes.func.isRequired,
  removeChat: React.PropTypes.func.isRequired,
  boardSubscribe: React.PropTypes.func.isRequired,
  togglePosition: React.PropTypes.func.isRequired,
  toggleError: React.PropTypes.func.isRequired,
};
