import React from 'react';
import ReactDOMServer from 'react-dom/server';

import NavbarLink from './navbar-link/NavbarLink.jsx';
import Profile from './profile/Profile.jsx';
// import SearchBar from './search-bar/SearchBar.jsx';
import Popover from './popover/Popover.jsx';

export default class NavbarLayout extends React.Component {
  render() {
    return (
      <nav className="navbar header">
        <div className="container-fluid">
          <div className="navbar-header">
            <button className="navbar-toggle collapsed" 
                    type="button" 
                    data-toggle="collapse" 
                    data-target="#bs-example-navbar-collapse-1" 
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
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <NavbarLink active={ true } 
                          link={ '/dashboard' } 
                          name={ 'Dashboard' } />
              <NavbarLink active={ false } 
                          link={ '/help' } 
                          name={ 'Help' } />
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <a class="UserPhotoPopover"
                data-container="body"
                data-toggle="popover"
                data-placement="bottom"
                data-content="">
                <Profile image={ this.props.image } />
              </a>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
  componentDidMount() {
    const { image, name, email } = this.props;
    $('[data-toggle="popover"]').popover({
      html : true, 
      content: function() {
        const popover = <Popover image={ image } 
                                 name={ name } 
                                 email={ email } />;
        return ReactDOMServer.renderToString(popover);
      }
    });
  }
}

NavbarLayout.propTypes = {
  name: React.PropTypes.string.isRequired,
  image: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
};