import React              from 'react';
import classNames         from 'classnames';

import ModulesCollapsible from './collapsible/modules/ModulesCollapsible.jsx';
import BoardsCollapsible  from './collapsible/boards/BoardsCollapsible.jsx';
import ChatsCollapsible   from './collapsible/chats/ChatsCollapsible.jsx';

export default class SidebarLayout extends React.Component {
  render() {
    let classes = classNames('sidebar', 'hidden-xs', {
      'permission-asker-opened': this.props.permissionAsker
    });
    
    return (
      <div className={ classes }>
        <div  id='boards-item'
              className='item no-margin'
              onClick={ this.props.toggleCollapsible.bind(null, 'boards') }>
          <img src='/img/sidebar/boards.svg' width='32px' />
          <p className='text item-title'>Boards</p>
        </div>
        <div  id='modules-item'
              className='item'
              onClick={ this.props.toggleCollapsible.bind(null, 'modules') }>
          <img src='/img/sidebar/modules.svg' width='32px' />
          <p className='text item-title'>Módulos</p>
        </div>
        <div  id='chats-item'
              className='item'
              onClick={ this.props.toggleCollapsible.bind(null, 'chats') }>
          <img src='/img/sidebar/messages.svg' width='32px' />
          <p className='text item-title'>Mensajes</p>
        </div>
        {
          this.props.owner ? (
            <div  id='settings-item'
                  className='item bottom'
                  onClick={ this.props.openConfigTeamModal.bind(this) }>
              <img src='/img/sidebar/config.svg' width='32px' />
            </div>
          ) : ( null )
        }

        <ModulesCollapsible
          modules={ this.props.modules }
          toggleCollapsible={ this.props.toggleCollapsible } />
        <BoardsCollapsible
          boards={ this.props.boards }
          team={ this.props.team }
          owner={ this.props.owner }
          toggleCollapsible={ this.props.toggleCollapsible }
          changeBoard={ this.props.changeBoard }
          openCreateBoardModal={ this.props.openCreateBoardModal }
          openBoardContextMenu={ this.props.openBoardContextMenu } />
        <ChatsCollapsible
          boards={ this.props.boards }
          directChats={ this.props.directChats }
          toggleCollapsible={ this.props.toggleCollapsible }
          addChat={ this.props.addChat }
          openCreateChatModal={ this.props.openCreateChatModal } />
      </div>
    );
  }
}

SidebarLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  owner: React.PropTypes.bool.isRequired,

  boards: React.PropTypes.array.isRequired,
  modules: React.PropTypes.array.isRequired,

  directChats: React.PropTypes.array.isRequired,

  addChat: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
  openBoardContextMenu: React.PropTypes.func.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
  
  openCreateBoardModal: React.PropTypes.func.isRequired,
  openCreateChatModal: React.PropTypes.func.isRequired,
  openConfigTeamModal: React.PropTypes.func.isRequired,
  
  permissionAsker: React.PropTypes.bool.isRequired,
};
