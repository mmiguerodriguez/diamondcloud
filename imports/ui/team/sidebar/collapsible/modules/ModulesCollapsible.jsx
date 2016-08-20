import React from 'react';

import Collapsible from '../Collapsible.jsx';
import Module      from './module/Module.jsx';

export default class ModulesCollapsible extends React.Component {
  render() {
    return (
      <Collapsible
        id={ 'modules-collapsible' }
        header={
          <div>
            <div  type="button"
                  className="close col-xs-2"
                  onClick={ this.props.toggleCollapsible.bind(null, 'modules') }>
              <img src="/img/close-modal-icon.svg" width="18px" />
            </div>
            <h3 className="col-xs-10 title">Módulos</h3>
          </div>
        }
        body={
          this.renderModules()
        }
        footer={
          <a className="btn btn-default footer-btn" role="button">
            <img src="/img/sidebar/shop-cart.svg" width="32px" />
          </a>
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
      arr.push(<Module key={ module._id } module={ module } />);
    });

    return arr;
  }
}

ModulesCollapsible.propTypes = {
  modules: React.PropTypes.array.isRequired,
  toggleCollapsible: React.PropTypes.func.isRequired,
};
