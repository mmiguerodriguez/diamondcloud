import React from 'react';

import TeamCard from './team-card/TeamCard.jsx';

export default class TeamsLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = { search: '' };
    this.handleChange = this.handleChange.bind(this);
  }
  render() {
    return (
      <div className='container team-container'>
        <div className='row'>
          <div className='col-md-6'>
            <h3>
              <b>Equipos</b>
            </h3>
          </div>
          <div className='col-md-6'>
            <div className='input-group col-md-6 search-teams' role='button'>
              <input  id='searchTeams'
                      value={ this.state.search }
                      className='form-control input'
                      placeholder='Busca tus equipos'
                      type='search'
                      onChange={ this.handleChange }/>
              <div className='input-group-addon icon'>
                <img src='/img/search.svg'
                     width='24px' />
              </div>
            </div>
          </div>
        </div>
        {
          this.state.search !== '' ? (
            <div className='row search-results'>
              <div className='col-md-12'>
                <p className='text-muted text-center'>Resultados: { this.searchResults() }</p>
              </div>
            </div>
          ) : ( null )
        }
        <div className=''>
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
  renderTeams() {
    if (this.props.hasTeams) {
      return this.props.teams.map((team) => {
        return team.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1 ? (
          <TeamCard
            key={team._id}
            team={team}
            isAdmin={team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')}
            hasTeams={this.props.hasTeams}
            openConfigTeamModal={this.props.openConfigTeamModal}
          />
      ) : ( null );
      });
    } else {
      return (
        <TeamCard hasTeams={ this.props.hasTeams } />
      );
    }
  }
  searchResults() {
    let results = 0;
    this.props.teams.forEach((team) => {
      if (team.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1) {
        results++;
      }
    });
    return results;
  }
}

TeamsLayout.propTypes = {
  teams: React.PropTypes.array.isRequired,
  hasTeams: React.PropTypes.bool.isRequired,
};
