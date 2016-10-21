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
  
    this.props.users.forEach((user) => {
      let directChat = DirectChats.getDirectChat(user._id, this.props.team._id);

      console.log(directChat, user._id);
      
      if (user._id !== Meteor.userId()) {
        if (!directChat) {
          arr.push(
            <User
              key={user._id}
              user={user}
              team={this.props.team}
              addChat={this.props.addChat}
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
            (this.props.directChats.length !== 0 || this.props.users.length !== 0) ? (
              <div>
                {this.renderDirectChats()}
                {this.renderUsers()}
              </div>
            ) : (
              <p className='no-chat-text'>No tienes chats activos, para crear uno hacé click en <img src='/img/add-people-icon.svg' width='18px' /></p> 
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
};
