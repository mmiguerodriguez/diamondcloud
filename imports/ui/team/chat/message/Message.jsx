import React from 'react';

export default class MessageLayout extends React.Component {
  render() {
    return (
      <div>

      </div>
    );
  }
}

/**
 * TODO: Render actual message
 */

MessageLayout.propTypes = {
  message: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired
};
