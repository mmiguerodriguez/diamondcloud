import React from 'react';
import ReactDOMServer from 'react-dom/server';

import NavbarLink from './navbar-link/NavbarLink.jsx';
import Profile from './profile/Profile.jsx';
// import SearchBar from './search-bar/SearchBar.jsx';
import Popover from './popover/Popover.jsx';

export default class NavbarLayout extends React.Component {
  render() {
    let { user } = this.props;
    return (
      <nav className="navbar header">
        <div className="container-fluid">
          <div className="navbar-header">
            <button className="navbar-toggle collapsed"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbar"
                    aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a>
              <img src="img/logo.svg" className="logo-photo"/>
            </a>
          </div>
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="nav navbar-nav">
              {
                user ? (
                  <NavbarLink
                    active={ true }
                    link={ '/dashboard' }
                    name={ 'Dashboard' } />
                ) : ( null )
              }

              <NavbarLink active={ false }
                          link={ '/help' }
                          name={ 'Help' } />
            </ul>
            <ul className="nav navbar-nav navbar-right">
            {
              user ? (
                <a className="UserPhotoPopover"
                  data-container="body"
                  data-toggle="popover"
                  data-placement="bottom"
                  data-content="">
                  <Profile picture={ user.profile.picture } />
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
    $('[data-toggle="popover"]').popover({
      html: true,
      content: function() {
        const popover = <Popover user={ user } />;
        return ReactDOMServer.renderToString(popover);
      }
    });
  }
}

NavbarLayout.propTypes = {
  user: React.PropTypes.object,
  path: React.PropTypes.string.isRequired,
};
