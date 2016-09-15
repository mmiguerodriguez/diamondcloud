import React from 'react';

export default class Module extends React.Component {
  constructor(props) {
    super(props);

    this.refs = {
      'module-item': null,
    };
  }
  render() {
    return (
      <div className='module-item row' ref='module-item' role="button" data-module-id={ this.props.module._id }>
        <div className='col-xs-2'>
          <img src={ this.props.module.img } className='img module-preview' width='32px' />
        </div>
        <h4 className='col-xs-10 module-name'>{ this.props.module.name }</h4>
      </div>
    );
  }
  componentDidMount() {
    let self = this;
    let module = this.refs['module-item'];

    $(module).draggable({
      cursor: 'pointer',
      containment: $('.board'),
      helper(event) {
        return $('<img src="' + self.props.module.img + '">');
      }
    });
  }
}

Module.propTypes = {
  module: React.PropTypes.object.isRequired,
};
