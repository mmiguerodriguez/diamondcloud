import React from 'react';
import { Link } from 'react-router';

export default class NavbarLink extends React.Component {
  render() {
    let { active, link, name } = this.props;
    active = active === true ? 'active' : '';
    
    return (
      <li className={ active }>
        <Link to={ link } className="li-navbar-text">{ name }</Link>
      </li>
    );
  }
}

NavbarLink.propTypes = {
  active: React.PropTypes.bool.isRequired,
  link: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
};