import React from 'react';

export default class Profile extends React.Component {
  render() {
    return (
        <img src={ this.props.picture } className='img-circle user-photo' data-ripple="rgba(0,0,0, 0.3)" />
    );
  }
}

Profile.propTypes = {
  picture: React.PropTypes.string.isRequired,
};
