import { Meteor }          from 'meteor/meteor';

import React               from 'react';
import { browserHistory }  from 'react-router';

export default class Popover extends React.Component {
  render() {
    let user = this.props.user;
    return (
      <div>
        <div className='row popover-data'>
          <div className='col-xs-3'>
            <img alt='User' src={ user.profile.picture } className='popover-user-photo' />
          </div>
          <div className='col-xs-7'>
            <b className='user-info'>{ user.profile.name }</b>
            <p className='user-mail text-muted'>{ user.email() }</p>
          </div>
        </div>
        <hr />
        <div className='row popover-footer'>
          <div className='btn col-xs-4 col-xs-offset-1 popover-btn'>
            <p className='popover-btn-text'>Cambiar datos</p>
          </div>
          <div className='btn col-xs-4 col-xs-offset-2 popover-btn'>
            <p className='popover-btn-text' onClick={ this.logout.bind(this) }>Cerrar Sesion</p>
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
