import React from 'react';

export default class Profile extends React.Component {
  render() {
    return (
      <li>
        <img src={ this.props.picture } className="img-circle user-photo" />
      </li>
    );
  }
}

Profile.propTypes = {
  picture: React.PropTypes.string.isRequired,
};
