import React      from 'react';
import classNames from 'classnames';

export default class WelcomeCard extends React.Component {
  render() {
    let textClass = classNames({
      'col-xs-7': this.props.hasTeams,
      'col-xs-6': !this.props.hasTeams,
    }, 'welcome-text');
    let photoClass = classNames({
      'col-xs-5': this.props.hasTeams,
      'col-xs-6': !this.props.hasTeams,
    }, 'welcome-card-photo-div');
    
    return (
      <div className='welcome-card row'>
        <div className={ textClass }>
          <h1>
            <b> 
              { 
                this.hasTeams ? 
                'Conectate con tu equipo' : 
                'Empezá a colaborar con tu equipo' 
              }
            </b>
          </h1>
          <p className='text-muted'>Aca vamos a tener que poner una bajada para que no quede tan vacio (en gris).</p>
          <a className='btn btn-default new-team-btn'
             role='button'
             onClick={ this.props.openCreateTeamModal }>
            CREAR NUEVO EQUIPO
          </a>
        </div>
        <div className={ photoClass }>
          <img src='/img/dashboard.png' className='welcome-card-photo hidden-xs' />
        </div>
      </div>
    );
  }
}

WelcomeCard.propTypes = {
  hasTeams: React.PropTypes.bool.isRequired,
  openCreateTeamModal: React.PropTypes.func.isRequired,
};