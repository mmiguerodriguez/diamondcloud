import React from 'react';

export default class SidebarLayout extends React.Component {
  render() {
    return (
      <div className="sidebar">
        <div className="item">
          <img src="http://image.flaticon.com/icons/png/512/102/102260.png" width="48px" />
          <p className="text">Boards</p>
        </div>
        <div className="item">
          <img src="http://image.flaticon.com/icons/svg/171/171089.svg" width="48px" />
          <p className="text">Módulos</p>
        </div>
        <div className="item">
          <img src="http://image.flaticon.com/icons/svg/60/60527.svg" width="48px" />
          <p className="text">Mensajes</p>
        </div>

        <div className="item bottom">
          <img src="http://image.flaticon.com/icons/png/512/61/61094.png" width="48px" />
        </div>
      </div>
    );
  }
}

SidebarLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
};
