import React from 'react';

import DirectChat from './direct-chat/DirectChat.jsx';

export default class DirectChatsLayout extends React.Component {
  render() {
    return (
      <div className='container-fluid'>
        <h5>
          <b>Chats</b>
        </h5>
        <hr className='hr-fixed-color' />
        <div>
          { this.renderDirectChats() }
        </div>
      </div>
    );
  }

  renderDirectChats() {
    let arr = [];

    this.props.directChats.map((directChat) => {
      let notifications, user;
      directChat.users.map((_user) => {
        if(_user._id !== Meteor.userId()) {
          user = Meteor.users.findOne(_user._id).profile.name;
        } else {
          notifications = _user.notifications;
        }
      });

      notifications = notifications || 0;

      arr.push(
        <DirectChat
          key={ directChat._id }
          directChat={ directChat }
          user={ user }
          notifications={ notifications }
          getMessages={ this.props.getMessages } />
      );
    });

    return arr;
  }
}

DirectChatsLayout.propTypes = {
  directChats: React.PropTypes.array.isRequired,
  getMessages: React.PropTypes.func.isRequired,
};
