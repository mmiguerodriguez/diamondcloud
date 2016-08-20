import React from 'react';

import { Teams } from '../../../api/teams/teams.js';

import ModulesCollapsible from './collapsible/modules/ModulesCollapsible.jsx';
import BoardsCollapsible  from './collapsible/boards/BoardsCollapsible.jsx';
import ChatsCollapsible   from './collapsible/chats/ChatsCollapsible.jsx';
import CreateBoardModal   from '../../modals/create-board/CreateBoardModal.jsx';
import CreateChatModal    from '../../modals/create-chat/CreateChatModal.jsx';
import ConfigTeamModal    from '../../modals/config-team/ConfigTeamModal.jsx';

export default class SidebarLayout extends React.Component {
  render() {
    return (
      <div className='sidebar'>
        <div  id='boards-item'
              className='item no-margin'
              onClick={ this.toggleCollapsible.bind(this, 'boards') }>
          <img src='/img/sidebar/boards.svg' width='32px' />
          <p className='text item-title'>Boards</p>
        </div>
        <div  id='modules-item'
              className='item'
              onClick={ this.toggleCollapsible.bind(this, 'modules') }>
          <img src='/img/sidebar/modules.svg' width='32px' />
          <p className='text item-title'>Módulos</p>
        </div>
        <div  id='chats-item'
              className='item'
              onClick={ this.toggleCollapsible.bind(this, 'chats') }>
          <img src='/img/sidebar/messages.svg' width='32px' />
          <p className='text item-title'>Mensajes</p>
        </div>
        {
          this.props.owner ? (
            <div  id='settings-item'
                  className='item bottom'
                  onClick={ this.openConfigTeamModal.bind(this) }>
              <img src='/img/sidebar/config.svg' width='32px' />
            </div>
          ) : ( null )
        }

        <ModulesCollapsible
          toggleCollapsible={ this.toggleCollapsible.bind(this) } />
        <BoardsCollapsible
          boards={ this.props.boards }
          team={ this.props.team }
          owner={ this.props.owner }
          toggleCollapsible={ this.toggleCollapsible.bind(this) }
          changeBoard={ this.props.changeBoard }
          openCreateBoardModal={ this.openCreateBoardModal } />
        <ChatsCollapsible
          boards={ this.props.boards }
          directChats={ this.props.directChats }
          toggleCollapsible={ this.toggleCollapsible.bind(this) }
          getMessages={ this.props.getMessages }
          openCreateChatModal={ this.openCreateChatModal } />

        {
          this.props.owner ? (
            <div>
              <CreateBoardModal
                team={ this.props.team }
                getMessages={ this.props.getMessages }
                changeBoard={ this.props.changeBoard }
                toggleCollapsible={ this.toggleCollapsible.bind(this) } />
              <ConfigTeamModal
                key={ this.props.team._id }
                team={ this.props.team }
                loadTeam={ this.loadTeam.bind(this) } />
            </div>
          ) : ( null )
        }
        <CreateChatModal
          team={ this.props.team }
          getMessages={ this.props.getMessages }
          toggleCollapsible={ this.toggleCollapsible.bind(this) } />

      </div>
    );
  }

  // collapsibles
  toggleCollapsible(name) {
    let elem = name + '-' + 'collapsible';
    let active = this.checkActive(elem);

    this.hideAllActiveBackgrounds();

    if(active) {
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

      if(elem.css('display') === 'block')  {
        let id = elem.attr('id');
        if(name === id) {
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

      if(elem.css('display') === 'block') {
        activeElement = elem;
      }
    });

    if(!!activeElement) {
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

      if(!elem.hasClass('bottom')){
        if(elem.css('backgroundColor') === 'rgb(255, 255, 255)'){
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

  // open modals
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
  loadTeam(id, callback){
    this.setState({
      team: Teams.findOne(id),
    }, callback);
  }
}

SidebarLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  owner: React.PropTypes.bool.isRequired,
  directChats: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
};
