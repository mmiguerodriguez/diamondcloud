import React from 'react';

export default class Profile extends React.Component {
  render() {
    return (
        <img src={ this.props.picture } className='img-circle user-photo' />
    );
  }
}

Profile.propTypes = {
  picture: React.PropTypes.string.isRequired,
};
