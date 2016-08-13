import React from 'react';

import ModulesCollapsible from './collapsible/modules/ModulesCollapsible.jsx';
import BoardsCollapsible  from './collapsible/boards/BoardsCollapsible.jsx';
import ChatsCollapsible   from './collapsible/chats/ChatsCollapsible.jsx';

export default class SidebarLayout extends React.Component {
  render() {
    return (
      <div className="sidebar">
        <div  id="boards-item"
              className="item no-margin"
              onClick={ this.toggleCollapsible.bind(this, 'boards') }>
          <img src="/img/sidebar/boards.svg" width="32px" />
          <p className="text item-title">Boards</p>
        </div>
        <div  id="modules-item"
              className="item"
              onClick={ this.toggleCollapsible.bind(this, 'modules') }>
          <img src="/img/sidebar/modules.svg" width="32px" />
          <p className="text item-title">Módulos</p>
        </div>
        <div  id="chats-item"
              className="item"
              onClick={ this.toggleCollapsible.bind(this, 'chats') }>
          <img src="/img/sidebar/messages.svg" width="32px" />
          <p className="text item-title">Mensajes</p>
        </div>

        <div className="item bottom">
          <img src="/img/sidebar/config.svg" width="32px" />
        </div>

        <ModulesCollapsible
          toggleCollapsible={ this.toggleCollapsible.bind(this) } />
        <BoardsCollapsible
          boards={ this.props.boards }
          toggleCollapsible={ this.toggleCollapsible.bind(this) }
          changeBoard={ this.props.changeBoard } />
        <ChatsCollapsible
          boards={ this.props.boards }
          directChats={ this.props.directChats }
          toggleCollapsible={ this.toggleCollapsible.bind(this) }
          getMessages={ this.props.getMessages }/>
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
    } else {
      this.hideActive(() => {
        $('#' + elem).effect('slide', {
          direction: 'left',
          mode: 'show',
        }, 350);

        this.showBackground($('#' + name + '-' + 'item'));
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
      activeElement.effect('slide', {
        direction: 'left',
        mode: 'hide',
      }, 350, callback);
    } else {
      callback();
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
}

SidebarLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
  changeBoard: React.PropTypes.func.isRequired,
};
