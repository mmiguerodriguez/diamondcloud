import React from 'react';
import { Link } from 'react-router';

export default class TeamCard extends React.Component {
  render() {
    return (
      this.props.hasTeams === true ? (
        <div className='col-md-3 teams'>
          <div className='row team-image'>
            {
              this.props.owner ? (
                <a role='button'
                   onClick={ this.props.openConfigTeamModal.bind(null, this.props.team) }>
                  <img src='/img/teamconfig.svg' className='config-icon' />
                </a>
              ) : ( null )
            }
          </div>
          <div className='row team-data'>
            <div className='col-xs-12'>
              <h4>
                <b>{ this.props.team.name }</b>
              </h4>
              <h5>Plan: { this.props.team.plan }</h5>
              {
                this.props.team.users.length >= 4 ? (
                  <h5>Miembros:
                    <b className='text-danger'>
                      &nbsp;{ this.props.team.users.length }/5
                    </b>
                  </h5>
                ) : (
                  <h5>Miembros: { this.props.team.users.length }/5</h5>
                )
              }
            </div>
          </div>
          <Link to={ '/team/' + this.props.team._id }
                className='col-md-4 btn open-team-btn'
                role='button'>
            Abrir
          </Link>
        </div>
      ) : (
        <div className='col-md-3 team-false'>
          <h4>Tu proximo equipo</h4>
          <div className='block-data-1'></div>
          <div className='block-data-2'></div>
        </div>
      )
    );
  }
}

TeamCard.propTypes = {
  team: React.PropTypes.object.isRequired,
  hasTeams: React.PropTypes.bool.isRequired,
  owner: React.PropTypes.bool.isRequired,
  openConfigTeamModal: React.PropTypes.func.isRequired,
};
