import React           from 'react';

import { DirectChats } from '../../../../../../api/direct-chats/direct-chats';

import User            from './user/User.jsx';
import DirectChat      from './direct-chat/DirectChat.jsx';

export default class DirectChatsLayout extends React.Component {
  renderDirectChats() {
    return this.props.directChats.map((directChat) => {
      return (
        <DirectChat
          key={directChat._id}
          directChat={directChat}
          user={directChat.getUser()}
          notifications={directChat.getNotifications()}
          addChat={this.props.addChat}
        />
      );
    });
  }

  renderUsers() {
    let arr = [];
  
    this.props.team.users.forEach((_user) => {
      const user = Meteor.users.findByEmail(_user.email, {});

      if (user._id !== Meteor.userId()) {
        let directChat = DirectChats.getDirectChat(user._id, this.props.team._id);
        if (!directChat) {
          arr.push(
            <User
              key={user._id}
              user={user}
              team={this.props.team}
              addChat={this.props.addChat}
              createDirectChat={this.props.createDirectChat}
            />
          );
        }
      }
    });
  
    return arr;
  }

  render() {
    return (
      <div className='container-fluid'>
        <h5>
          <b>Chats</b>
        </h5>
        <hr className='hr-fixed-color' />
        <div>
          {
            this.props.directChats.length > 0 || this.props.team.users.length > 1 ? (
              <div>
                {this.renderDirectChats()}
                {this.renderUsers()}
              </div>
            ) : (
              <p className='no-chat-text'>
                No hay usuarios en el equipo, para compartirlo hacé click <a onClick={this.props.openConfigTeamModal} role="button">acá</a>
              </p> 
            )
          }
        </div>
      </div>
    );
  }
}

DirectChatsLayout.propTypes = {
  team: React.PropTypes.object.isRequired,
  users: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  addChat: React.PropTypes.func.isRequired,
  createDirectChat: React.PropTypes.func.isRequired,
  openConfigTeamModal: React.PropTypes.func.isRequired,
};
