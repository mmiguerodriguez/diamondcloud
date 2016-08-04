import React from 'react';

export default class Module extends React.Component {
  render() {
    return (
      <div className="module-item row">
        <div className="col-md-2">
          <img src={ this.props.module.img } width="32px" className="img" />
        </div>
        <h4 className="col-md-10">{ this.props.module.name }</h4>
      </div>
    );
  }
}

Module.propTypes = {
  module: React.PropTypes.object.isRequired,
};