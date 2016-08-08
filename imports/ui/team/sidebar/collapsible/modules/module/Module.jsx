import React from 'react';

export default class Module extends React.Component {
  render() {
    return (
      <div className="module-item row">
        <div className="col-xs-2">
          <img src={ this.props.module.img } width="32px" className="img module-preview" />
        </div>
        <h4 className="col-xs-10 module-name">{ this.props.module.name }</h4>
      </div>
    );
  }
}

Module.propTypes = {
  module: React.PropTypes.object.isRequired,
};