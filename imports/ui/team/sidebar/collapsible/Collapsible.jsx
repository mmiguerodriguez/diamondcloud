import React from 'react';

export default class Collapsible extends React.Component {
  render() {
    return (
      <div className='collapsible' id={ this.props.id }>
        <div className='collapsible-header row'>
          { this.props.header }
        </div>
        <div className='collapsible-body'>
          { this.props.body }
        </div>
        <div className='collapsible-footer'>
          { this.props.footer }
        </div>
      </div>
    );
  }
}

Collapsible.propTypes = {
  id: React.PropTypes.string.isRequired,
  header: React.PropTypes.element.isRequired,
  body: React.PropTypes.any.isRequired,
  footer: React.PropTypes.element.isRequired,
};
