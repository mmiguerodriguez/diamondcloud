import React from 'react';

export default class TeamCard extends React.Component {
  render() {
    let { team } = this.props;
    
    return (
      this.props.hasTeams ? (
        <div>
          <h4>{ team.name }</h4>
        </div>
      ) : (
      <div className="row">
        <div className="col-md-3 team-false">
          <h4>Tu proximo equipo</h4>
          <div className="block-data-1"></div>
          <div className="block-data-2"></div>
        </div>
      </div>  
      )
    );
  }
}

TeamCard.propTypes = {
  team: React.PropTypes.object,
  hasTeams: React.PropTypes.bool,
};