import React from 'react';

import Module from './module/Module.jsx';

export default class ModulesCollapsibleLayout extends React.Component {
  render() {
    return (
      <div className="collapsible">
        <div className="header row">
          <div type="button" className="close col-md-2">
            <img src="/img/close-modal-icon.svg" width="18px" />
          </div>
          <h3 className="col-md-10 title">Modulos</h3>
        </div>
        <div className="modules-list">
          { this.renderModules() }
        </div>
      </div>
    );
  }
  renderModules() {
    let arr = [];
    let modules = [
      { _id: '1', name: 'Text 1', img: 'http://image.flaticon.com/icons/png/512/102/102260.png' },
      { _id: '2', name: 'Text 2', img: 'http://image.flaticon.com/icons/png/512/102/102260.png' },
      { _id: '3', name: 'Text 3', img: 'http://image.flaticon.com/icons/png/512/102/102260.png' },
      { _id: '4', name: 'Text 4', img: 'http://image.flaticon.com/icons/png/512/102/102260.png' }
    ];
    
    modules.map((module) => {
      arr.push(<Module module={ module } />);
    });
    return arr;
  }
}

ModulesCollapsibleLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
};