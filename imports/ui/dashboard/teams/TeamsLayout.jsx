import React from 'react';

import TeamCard from './team-card/TeamCard.jsx';

export default class TeamsLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }
  render() {
    return (
      <div className="container team-container">
        <div className="row">
          <div className="col-md-6">
            <h3>
              <b>Equipos</b>
            </h3>
          </div>
          <div className="col-md-6">
            <div className="input-group col-md-6 search-teams" role="button">
              <input  id="searchTeams"
                      value={ this.state.search }
                      className="form-control input"
                      placeholder="Busca tus equipos"
                      type="search"
                      onChange={ this.handleChange.bind(this) }/>
              <div className="input-group-addon icon">
                <img src="/img/search.svg"
                     width="24px" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          { this.renderTeams() }
        </div>
      </div>
    );
  }
  handleChange(event) {
    this.setState({
      search: event.target.value,
    });
  }
  renderTeams(){
    if(this.props.hasTeams) {
      return this.props.teams.map((team) => {
        return team.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1 ? (
          <TeamCard
            key={ team._id }
            team={ team }
            hasTeams={ this.props.hasTeams }
            openConfigTeamModal={ this.props.openConfigTeamModal }
          />
      ) : ( null );
      });
    } else {
      return (
        <TeamCard hasTeams={ this.props.hasTeams }/>
      );
    }
  }
}

TeamsLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
  hasTeams: React.PropTypes.bool.isRequired,
};
