import React from 'react';

import ModulesCollapsible from './collapsible/modules/ModulesCollapsible.jsx';

export default class SidebarLayout extends React.Component {
  render() {
    return (
      <div className="sidebar">
        <div className="item">
          <img src="/img/sidebar/boards.svg" width="48px" />
          <p className="text">Boards</p>
        </div>
        <div className="item">
          <img src="/img/sidebar/modules.svg" width="48px" />
          <p className="text">Módulos</p>
        </div>
        <div className="item">
          <img src="/img/sidebar/messages.svg" width="48px" />
          <p className="text">Mensajes</p>
        </div>

        <div className="item bottom">
          <img src="/img/sidebar/config.svg" width="48px" />
        </div>

        <ModulesCollapsible />
      </div>
    );
  }
}

SidebarLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
};
