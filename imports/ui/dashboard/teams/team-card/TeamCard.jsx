import React from 'react';

export default class TeamCard extends React.Component {
  render() {
    return (
      <div>
        <h4>{ this.props.team.name }</h4>
      </div>
    );
  }
}

TeamCard.propTypes = {
  team: React.PropTypes.object.isRequired,
};