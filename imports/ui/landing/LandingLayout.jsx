import React             from 'react';
import classNames        from 'classnames';

import { TEAMS }         from '../../api/teams/teams';

import AccountsUIWrapper from '../accounts/AccountsUIWrapper';

export default class LandingLayout extends React.Component {
  render() {
    const path = this.props.params.teamUrl;
    const logos = {};
    const backgrounds = {};

    TEAMS.forEach((team) => {
      backgrounds[`/img/teams/${team.url}/background.jpg`] = team.url === path;
      logos[`/img/teams/${team.url}/logo.png`] = team.url === path;
    });

    return (
      <div className="landing">
        <img className="background" src={classNames(backgrounds)} alt="Fondo del equipo" />
        <div className="items-container">
          <img className="title" src={classNames(logos)} alt="Logo del equipo" />
          <AccountsUIWrapper />
        </div>
      </div>
    );
  }
}

LandingLayout.propTypes = {
  location: React.PropTypes.object.isRequired,
};
