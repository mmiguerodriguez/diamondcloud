import React from 'react';
import { Link } from 'react-router';

export default class TeamCard extends React.Component {
  render() {
    return (
      this.props.hasTeams === true ? (
        <div className='col-md-3'>
          <div className='teams'>
            <div className='team-image'>
              {
                this.props.isAdmin ? (
                  <a className='config-background' role='button'
                     onClick={ this.props.openConfigTeamModal.bind(null, this.props.team) }>
                    <img src='/img/teamconfig.svg' className='config-icon' />
                  </a>
                ) : ( null )
              }
            </div>
            <div className='team-data'>
              <div className='col-xs-12'>
                <h4>
                  <b>{ this.props.team.name }</b>
                </h4>
                <h5>Plan: { this.props.team.plan }</h5>
                <h5>Miembros: { this.props.team.users.length }
                </h5>
              </div>
            </div>
            <Link
              to={ '/team/' + this.props.team._id }
              className='col-md-4 btn open-team-btn'
              role='button'>
              Abrir
            </Link>
          </div>
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
  team: React.PropTypes.object,
  hasTeams: React.PropTypes.bool.isRequired,
  isAdmin: React.PropTypes.bool,
  openConfigTeamModal: React.PropTypes.func,
};
