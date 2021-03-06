import React      from 'react';
import { Link }   from 'react-router';
import classNames from 'classnames';

export default class NavbarLink extends React.Component {
  render() {
    let active = classNames({
      active: this.props.active,
    });

    return (
      <li className={ active }>
        <Link
          to={ this.props.link }
          className='li-navbar-text'>
          { this.props.name }
        </Link>
      </li>
    );
  }
}

NavbarLink.propTypes = {
  active: React.PropTypes.bool.isRequired,
  link: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
};
