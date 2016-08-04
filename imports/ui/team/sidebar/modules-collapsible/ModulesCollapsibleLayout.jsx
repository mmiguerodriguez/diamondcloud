import React from 'react';

export default class ModulesCollapsibleLayout extends React.Component {
  render() {
    return (
      <div className="modules-collapsible">
      </div>
    );
  }
}

ModulesCollapsibleLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
};
