import React from 'react';

import Module from './module/Module.jsx';
import Collapsible from '../Collapsible.jsx';

export default class ModulesCollapsible extends React.Component {
  render() {
    return (
      <Collapsible
        header={
          <div>
            <div type="button" className="close col-md-2">
              <img src="/img/close-modal-icon.svg" width="18px" />
            </div>
            <h3 className="col-md-10 title">Modulos</h3>
          </div>
        }
        body={
          this.renderModules()
        }
      />
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

ModulesCollapsible.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
};