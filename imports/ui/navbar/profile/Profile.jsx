import React from 'react';

export default class Profile extends React.Component {
  render() {
    let { imageSrc } = this.props;
    return (
      <li>
        <img src={ imageSrc } className="img-circle user-photo" />
      </li>
    );
  }
}

Profile.propTypes = {
  imageSrc: React.PropTypes.string.isRequired,
};