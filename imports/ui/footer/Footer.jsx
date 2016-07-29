import React from 'react';
import { Link } from 'react-router';

export default class Footer extends React.Component {
  render() {
    return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <p className="col-xs-6 text-muted">
            <Link to='/pricing' className="footer-link">Pricing</Link>
          </p>
          <p className="col-xs-6 text-muted text-right">
            <Link to='/about' className="footer-link">About Us</Link>
          </p>
        </div>
      </div>
    </footer>
    );
  }
}