import React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <p className="col-xs-6 text-muted">Pricing</p>
          <p className="col-xs-6 text-right text-muted">About Us</p>
        </div>
      </div>
    </footer>
    );
  }
}