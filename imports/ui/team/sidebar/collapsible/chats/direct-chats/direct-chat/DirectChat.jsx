import React from 'react';

export default class DirectChat extends React.Component {
  render() {
    return (
      <div onClick={ this.props.getMessages.bind(null, { directChatId: this.props.directChat._id }) }>
        <h4 className="">{ this.props.directChat.users[0]._id }</h4>
      </div>
    );
  }
}

DirectChat.propTypes = {
  directChat: React.PropTypes.object.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
