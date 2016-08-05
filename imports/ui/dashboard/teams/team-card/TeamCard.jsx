import React from 'react';
import { Link } from 'react-router';

export default class TeamCard extends React.Component {
  render() {
    let { team } = this.props;

    return (
      this.props.hasTeams === true ? (
        <div className="col-md-3 teams">
          <div className="row team-data">
            <div className="col-xs-8">
              <h4>
                <b>{ team.name }</b>
              </h4>
              <h5>Plan: { team.plan }</h5>
              {
                team.users.length >= 4 ? (
                  <h5>Miembros:
                    <b className="text-danger">
                      &nbsp;{ team.users.length }/5
                    </b>
                  </h5>
                ) : (
                  <h5>Miembros: { team.users.length }/5</h5>
                )
              }
            </div>
            <div className="col-xs-4">
              <a role="button"
                 onClick={ this.props.openConfigTeamModal.bind(null, team) }>
                <img src="/img/teamconfig.svg" className="config-icon" />
              </a>
            </div>
          </div>
          <Link to={ "/team/" + team._id }
                className="col-md-4 btn open-team-btn"
                role="button">
            Abrir
          </Link>
        </div>
      ) : (
        <div className="col-md-3 team-false">
          <h4>Tu proximo equipo</h4>
          <div className="block-data-1"></div>
          <div className="block-data-2"></div>
        </div>
      )
    );
  }
}

TeamCard.propTypes = {
  team: React.PropTypes.object,
  hasTeams: React.PropTypes.bool,
  openConfigTeamModal: React.PropTypes.func,
};
