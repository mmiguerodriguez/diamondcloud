import React from 'react';

export default class User extends React.Component {
  render() {
    return (
      <div>User item</div>
    );
  }
}

User.propTypes = {
  user: React.PropTypes.object.isRequired,
};
