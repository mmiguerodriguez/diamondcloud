import React from 'react';

import ModulesCollapsible from './collapsible/modules/ModulesCollapsible.jsx';
import BoardsCollapsible  from './collapsible/boards/BoardsCollapsible.jsx';
import ChatsCollapsible   from './collapsible/chats/ChatsCollapsible.jsx';

export default class SidebarLayout extends React.Component {
  render() {
    return (
      <div className="sidebar">
        <div className="item no-margin" onClick={ this.toggleCollapsible.bind(this, 'boards') }>
          <img src="/img/sidebar/boards.svg" width="32px" />
          <p className="text">Boards</p>
        </div>
        <div className="item" onClick={ this.toggleCollapsible.bind(this, 'modules') }>
          <img src="/img/sidebar/modules.svg" width="32px" />
          <p className="text">Módulos</p>
        </div>
        <div className="item" onClick={ this.toggleCollapsible.bind(this, 'chats') }>
          <img src="/img/sidebar/messages.svg" width="32px" />
          <p className="text">Mensajes</p>
        </div>

        <div className="item bottom">
          <img src="/img/sidebar/config.svg" width="32px" />
        </div>

        <ModulesCollapsible toggleCollapsible={ this.toggleCollapsible } />
        <BoardsCollapsible  toggleCollapsible={ this.toggleCollapsible } />
        <ChatsCollapsible   toggleCollapsible={ this.toggleCollapsible } />
      </div>
    );
  }

  toggleCollapsible(name) {
    let elem = name + '-' + 'collapsible';
    let active = this.checkActive(elem);

    if(active) {
      this.hideActive();
    } else {
      this.hideActive(() => {
        $('#' + elem).effect('slide', {
          direction: 'left',
          mode: 'show',
        }, 350);
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

}

SidebarLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
};
