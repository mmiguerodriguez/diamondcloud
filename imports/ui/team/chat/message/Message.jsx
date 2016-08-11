import React from 'react';

export default class Message extends React.Component {
  render() {
    console.log('Message -> render -> message', this.props.message);
    return (
      <div>

      </div>
    );
  }
}

/**
 * TODO: Render actual message
 */

Message.propTypes = {
  message: React.PropTypes.object.isRequired,
  position: React.PropTypes.string.isRequired
};
