import React from 'react';

export default class Profile extends React.Component {
  render() {
    let { image } = this.props;
    return (
      <li>
        <img src={ image } className="img-circle user-photo" />
      </li>
    );
  }
}

Profile.propTypes = {
  image: React.PropTypes.string.isRequired,
};