import React from 'react';
import ReactDOMServer from 'react-dom/server';

import NavbarLink from './navbar-link/NavbarLink.jsx';
import Profile from './profile/Profile.jsx';
// import SearchBar from './search-bar/SearchBar.jsx';
import Popover from './popover/Popover.jsx';

export default class NavbarLayout extends React.Component {
  render() {
    return (
      <nav className='navbar header'>
        <div className='container-fluid'>
          <div className='navbar-header row'>
            <button className='navbar-toggle collapsed hidden-xs'
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
            <div className="col-xs-4 col-xs-offset-2 visible-xs-block">
              <div className="dropdown">
                <button className="btn"
                        id="dLabel"
                        type="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                  Teams
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dLabel">
                  <li className="item-li"><a href="#" className="item-a truncate">Diamond Cloud</a></li>
                  <li className="item-li"><a href="#" className="item-a truncate">Google</a></li>
                  <li className="item-li"><a href="#" className="item-a truncate">Tester</a></li>
                </ul>
              </div>
            </div>
            <div className="col-xs-4 visible-xs-block">
              <div className="right-align-icon user">
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
              </div>
              <div className="new right-align-icon"></div>
            </div>
          </div>
          <div className="tabs visible-xs-block">
              <ul className="nav nav-tabs" role="tablist">
                <li className="item col-xs-6 active">
                  <a href="#home" aria-controls="home" role="tab" data-toggle="tab" aria-expanded="false">
                    Boards
                  </a>
                </li>
                <li className="item col-xs-6">
                  <a href="#profile" aria-controls="profile" role="tab" data-toggle="tab" aria-expanded="true">
                    Users
                  </a>
                </li>
              </ul>
          </div>
          <div className='collapse navbar-collapse hidden-xs' id='navbar'>
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
            <ul className='nav navbar-nav navbar-right'>
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
  componentDidMount() {
    let { user } = this.props;
    if(user) {
      $('[data-toggle="popover"]').popover({
        html: true,
        content: function() {
          const popover = <Popover user={ user } />;
          return ReactDOMServer.renderToString(popover);
        }
      });
    }
  }
}

NavbarLayout.propTypes = {
  user: React.PropTypes.object,
  path: React.PropTypes.string.isRequired,
};
