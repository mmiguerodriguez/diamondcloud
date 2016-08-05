import React from 'react';

export default class ModulesCollapsible extends React.Component {
  render() {
    return (
      <div className="collapsible">
        <div className="header row">
          { this.props.header }
        </div>
        <div className="modules-list">
          { this.props.body }
        </div>
      </div>
    );
  }
}

ModulesCollapsible.propTypes = {
  header: React.PropTypes.element.isRequired,
  body: React.PropTypes.element.isRequired,
};