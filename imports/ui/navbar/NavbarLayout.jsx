import React from 'react';
import { Link } from 'react-router';

export default class NavbarLayout extends React.Component {
  render() {
    return (
      <nav className="navbar header">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
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
              <li className="active">
                <Link to="/dashboard" className="li-navbar-text">Dashboard</Link>
              </li>
              <li>
                <Link to="/help" className="li-navbar-text">Help</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <img src="//lh3.googleusercontent.com/-ri26AYShk-U/AAAAAAAAAAI/AAAAAAAAAAA/AOkcYIvpY_hVMZyXg-9VyubgjK139xag8A/s32-c-mo/photo.jpg" className="img-circle user-photo" />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}