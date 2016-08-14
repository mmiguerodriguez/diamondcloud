import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React               from 'react';

import { Teams }           from '../../api/teams/teams.js';
import { Boards }          from '../../api/boards/boards.js';
import { DirectChats }     from '../../api/direct-chats/direct-chats.js';
import { Messages }        from '../../api/messages/messages.js';

import TeamLayout          from './TeamLayout.jsx';

export default class Team extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptions: [],
    };
  }
  render() {
    if(this.props.loading) {
      return null;
    } else {
      return (
        <TeamLayout
          team={ this.props.team }
          boards={ this.props.boards }
          directChats={ this.props.directChats }
          chats={ this.formatChats() }
          getMessages= { this.getMessages.bind(this) }
        />
      );
    }
  }

  getMessages(obj) {
    let subscriptions = this.state.subscriptions;
    let isSubscribed = false;
    
    subscriptions.map((sub) => {
      if(sub[1] === obj.boardId || sub[1] === obj.directChatId) {
        isSubscribed = true;
      }
    });
    
    if(!isSubscribed) {
      let subscription = Meteor.subscribe('messages.chat', obj, {
        onError: (error) => {
          throw new Meteor.Error(error);
        },
      });
      
      subscriptions.push([subscription, obj.boardId || obj.directChatId]);
      
      this.setState({
        subscriptions: subscriptions,
      });
      
      this.formatChats(obj);
    }
  }
  formatChats(obj) {
    let chats = this.props.chats || [];
    let messages = this.props.messages;
    
    if(obj) {
      if(obj.boardId) {
        chats.push({
          boardId: obj.boardId,
          messages: [],
        });
      } else if(obj.directChatId) {
        chats.push({
          directChatId: obj.directChatId,
          messages: [],
        });
      }
    }
    
    messages.map((message) => {
      let chatExists = false;
      chats.map((chat) => {
        if(chat.directChatId === message.directChatId || chat.boardId === message.boardId) {
          chatExists = true;
        }
      });
      
      if(chatExists) {
        chats.map((chat) => {
          if(chat.directChatId === message.directChatId || chat.boardId === message.boardId) {
            let messageExists = false;
            chat.messages.map((_message) => {
              if(_message._id === message._id) {
                messageExists = true;
              }
            });
            
            if(!messageExists) {
              chat.messages.push(message);
            }
          }
        });
      } else {
        if(message.directChatId) {
          chats.push({
            directChatId: message.directChatId, 
            messages: [message],
          });
        } else if(message.boardId) {
          chats.push({
            boardId: message.boardId, 
            messages: [message],
          });
        }
      }
    });
    
    this.props.chats = chats;
    return chats;
  }
}

export default TeamPageContainer = createContainer(({ params }) => {
  const { teamId } = params;
  const teamHandle = Meteor.subscribe('teams.team', teamId);
  const loading = !teamHandle.ready();

  return {
    loading,
    team: Teams.findOne(),
    boards: Boards.find().fetch(),
    directChats: DirectChats.find().fetch(),
    messages: Messages.find().fetch(),
    chats: [],
  };
}, Team);
