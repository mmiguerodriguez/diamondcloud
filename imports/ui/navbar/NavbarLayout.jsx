import React from 'react';

export default class NavbarLayout extends React.Component {
  render() {
    return (
      <div>
        <nav className="navbar header navbar-default">
          <div className="container-fluid">
            <div>
              <a className="navbar-left navbar-img" href="#">
                <img alt="Brand" src="..." />
              </a>
              <a className="navbar-right navbar-img" href="#">
                <img alt="UserPhoto" className="img-circle" src="//lh3.googleusercontent.com/-ri26AYShk-U/AAAAAAAAAAI/AAAAAAAAAAA/AOkcYIvpY_hVMZyXg-9VyubgjK139xag8A/s32-c-mo/photo.jpg" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}