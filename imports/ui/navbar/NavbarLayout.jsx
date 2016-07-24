import React from 'react';

export default class NavbarLayout extends React.Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">
                <img alt="Brand" src="..." />
              </a>
            </div>
            <a className="navbar-brand navbar-right" href="#">
              <img alt="UserPhoto" src="..." />
            </a>
          </div>
        </nav>
      </div>
    );
  }
}