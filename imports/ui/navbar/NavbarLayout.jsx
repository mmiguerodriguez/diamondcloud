import React          from 'react';

import NavbarLink     from './navbar-link/NavbarLink.jsx';
import Profile        from './profile/Profile.jsx';
// import SearchBar   from './search-bar/SearchBar.jsx';
import Popover        from './popover/Popover.jsx';

import { browserHistory }  from 'react-router';

export default class NavbarLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = { createdPopover: false };
    this.logout = this.logout.bind(this);
  }
  render() {
    return (
      <nav className='navbar header'>
        <div className='container-fluid'>
          <div className='navbar-header row'>
            <button
              className='navbar-toggle collapsed'
              type='button'
              data-toggle='collapse'
              data-target='#navbar'
              aria-expanded='false'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <a className="col-xs-2">
              <img src='/img/logo.svg' className='logo-photo'/>
            </a>
          </div>
          <div className='collapse navbar-collapse' id='navbar'>
            <ul className='nav navbar-nav visible-xs-block'>
            {
              this.props.user ? (
                <div>
                  <a className='user-collapsible-photo col-xs-1'>
                    <Profile picture={ this.props.user.profile.picture } />
                  </a>
                  <div className="col-xs-7 user-data">
                    <b className='user-info'>{ this.props.user.profile.name }</b>
                    <p className='user-mail truncate'>{ this.props.user.email() }</p>
                  </div>
                  <div className='btn col-xs-3 popover-btn collapse-close-btn'>
                    <p className='popover-btn-text' onClick={ this.logout }>Cerrar Sesion</p>
                  </div>
                </div>
              ) : ( null )
            }
            </ul>
            <ul className='nav navbar-nav'>
              {
                this.props.user ? (
                  <NavbarLink
                    active={ this.props.path === '/dashboard' ? true : false }
                    link={ '/dashboard' }
                    name={ 'Dashboard' } />
                ) : ( null )
              }

              <NavbarLink
                active={ this.props.path === '/help' ? true : false }
                link={ '/help' }
                name={ 'Help' } />
            </ul>
            <ul className='nav navbar-nav navbar-right hidden-xs'>
            {
              this.props.user ? (
                <a className='UserPhotoPopover'
                  data-container='body'
                  data-toggle='popover'
                  data-placement='bottom'
                  data-content=''>
                  <Profile picture={ this.props.user.profile.picture } />
                </a>
              ) : ( null )
            }
            </ul>
          </div>
        </div>
      </nav>
    );
  }
  logout() {
    let self = this;
    Meteor.logout(() => {
      browserHistory.push('/'); // Redirect to landing page
      $('div[role="tooltip"].popover').remove(); // Remove actual node element
    });
  }
  componentDidUpdate() {
    if(this.props.user && !this.state.createdPopover) {
      let onLogout = () => {
        // Change createdPopover state to false when the user logs out
        this.setState({
          createdPopover: false,
        })
      }

      $('[data-toggle="popover"]').popover({
        react: true,
        content: (
          <Popover
            user={ this.props.user }
            onLogout={ onLogout } />
        ),
      });

      // Set the state as if user has created the popover
      this.setState({
        createdPopover: true,
      });
    }
  }
}

NavbarLayout.propTypes = {
  user: React.PropTypes.object,
  path: React.PropTypes.string.isRequired,
};
