import { Meteor }          from 'meteor/meteor';

import React               from 'react';
import { browserHistory }  from 'react-router';

export default class Popover extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }
  render() {
    return (
      <div>
        <div className='row popover-data'>
          <div className='col-xs-3'>
            <img alt='User' src={ `${this.props.user.profile.picture}?sz=60` } className='popover-user-photo' />
          </div>
          <div className='col-xs-9'>
            <b className='user-info'>{ this.props.user.profile.name }</b>
            <p className='user-mail text-muted truncate'>{ this.props.user.email() }</p>
            <p className='user-mail text-muted truncate'>
              { 
                /* this.props.user.getHierarchy(teamId) Aca va a aparecer la jerarquia del usuario. Saludos, Ryan del pasado. */ 
              }</p>
          </div>
        </div>
        <hr />
        <div className='row popover-footer'>
          <div className='btn col-xs-10 col-xs-offset-1 popover-btn'>
            <p className='popover-btn-text' onClick={ this.logout }>Cerrar Sesion</p>
          </div>
        </div>
      </div>
    );
  }
  logout() {
    let self = this;
    Meteor.logout(() => {
      browserHistory.push('/'); // Redirect to landing page
      $('div[role="tooltip"].popover').remove(); // Remove actual node element
      self.props.onLogout(); // Change NavbarLayout props
    });
  }
}

Popover.propTypes = {
  user: React.PropTypes.object.isRequired,
  onLogout: React.PropTypes.func.isRequired,
};
