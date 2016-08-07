import React from 'react';

export default class ModulesCollapsible extends React.Component {
  render() {
    return (
      <div className="collapsible" id={ this.props.id }>
        <div className="header row">
          { this.props.header }
        </div>
        <div className="modules-list">
          { this.props.body }
        </div>
        <div className="collapsible-footer">
          { this.props.footer }
        </div>
      </div>
    );
  }
}

ModulesCollapsible.propTypes = {
  id: React.PropTypes.string.isRequired,
  header: React.PropTypes.element.isRequired,
  body: React.PropTypes.any.isRequired,
  footer: React.PropTypes.element.isRequired,
};
