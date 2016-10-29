import React              from 'react';
import classNames         from 'classnames';

import ModulesCollapsible from './collapsible/modules/ModulesCollapsible';
import BoardsCollapsible  from './collapsible/boards/BoardsCollapsible';
import ChatsCollapsible   from './collapsible/chats/ChatsCollapsible';

export default class SidebarLayout extends React.Component {
  hasNotifications() {
    let hasNotifications = false;

    this.props.directChats.forEach((directChat) => {
      if (directChat.getNotifications() > 0) {
        hasNotifications = true;
      }
    });
    this.props.boards.forEach((board) => {
      if (board.getNotifications() > 0) {
        hasNotifications = true;
      }
    });
    
    return hasNotifications;
  }
  
  render() {
    const classes = classNames('sidebar', {
      'permission-asker-opened': this.props.permissionAsker,
    });

    return (
      <div className={classes}>
        <div
          id="boards-item"
          className="item no-margin"
          onClick={this.props.toggleCollapsible.bind(null, 'boards')}
        >
          <img src="/img/sidebar/boards.svg" width="32px" />
          <p className="text item-title">Boards</p>
        </div>
        <div
          id="modules-item"
          className="item"
          onClick={this.props.toggleCollapsible.bind(null, 'modules')}
        >
          <img src="/img/sidebar/modules.svg" width="32px" />
          <p className="text item-title">Módulos</p>
        </div>
        <div
          id="chats-item"
          className="item"
          onClick={this.props.toggleCollapsible.bind(null, 'chats')}
        >
          { 
            this.hasNotifications() ? (
              <div className="notification-badge"></div>
            ) : (null)
          }
          <img src="/img/sidebar/messages.svg" width="32px" />
          <p className="text item-title">Mensajes</p>
        </div>
        {
          this.props.isAdmin ? (
            <div
              id="settings-item"
              className="item bottom"
              onClick={this.props.openConfigTeamModal}
            >
              <img src="/img/sidebar/config.svg" width="32px" />
            </div>
          ) : (null)
        }

        <ModulesCollapsible
          modules={this.props.modules}
          toggleCollapsible={this.props.toggleCollapsible}
        />
        <BoardsCollapsible
          boards={this.props.boards}
          team={this.props.team}
          isAdmin={this.props.isAdmin}
          toggleCollapsible={this.props.toggleCollapsible}
          changeBoard={this.props.changeBoard}
          openCreateBoardModal={this.props.openCreateBoardModal}
          openBoardContextMenu={this.props.openBoardContextMenu}
        />
        <ChatsCollapsible
          team={this.props.team}
          users={this.props.users}
          boards={this.props.boards}
          directChats={this.props.directChats}
          addChat={this.props.addChat}
          createDirectChat={this.props.createDirectChat}
          toggleCollapsible={this.props.toggleCollapsible}
          openConfigTeamModal={this.props.openConfigTeamModal}
        />
      </div>
    );
  }
}

SidebarLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  isAdmin: React.PropTypes.bool.isRequired,
  users: React.PropTypes.array.isRequired,
  boards: React.PropTypes.array.isRequired,
  modules: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  addChat: React.PropTypes.func.isRequired,
  createDirectChat: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
  openBoardContextMenu: React.PropTypes.func.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
  openCreateBoardModal: React.PropTypes.func.isRequired,
  openConfigTeamModal: React.PropTypes.func.isRequired,
  permissionAsker: React.PropTypes.bool.isRequired,
};
