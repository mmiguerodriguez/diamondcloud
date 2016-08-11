import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';

import { Teams } from '../../api/teams/teams.js';
import { Boards } from '../../api/boards/boards.js';
import { DirectChats } from '../../api/direct-chats/direct-chats.js';
import { Messages } from '../../api/messages/messages.js';

import TeamLayout from './TeamLayout.jsx';

export default class Team extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
    };
  }
  render() {
    const { team, boards, directChats, loading } = this.props;
    const { chats } = this.state;

    if(loading) {
      return null;
    } else {
      return (
        <TeamLayout
          team={ team }
          boards={ boards }
          directChats={ directChats }
          chats={ chats }

          getMessages= { this.getMessages.bind(this) }
        />
      );
    }
  }

  getMessages(obj) {
    console.log('getMessages -> obj', obj);
    Meteor.subscribe('messages.chat', obj, {
      onReady: () => {
        let messages = Messages.find(obj).fetch();
        let chats =  this.state.chats;

        // Replace any undefined variable to an empty string
        obj.boardId = obj.boardId || '';
        obj.directChatId = obj.directChatId || '';

        // Checks if this chat exists
        let chatExists = false;
        chats.map((chat) => {
          if(!!chat.boardId || !!chat.directChatId) {
            chatExists = true;
          }
        });

        // console.log('chat exists', chatExists);

        if(chatExists) {
          // si existe un chat con obj.boardId o obj.directChat entonces
          // reemplazo chat.$.messages con los nuevos mensajes
          chats.map((chat) => {
            if(!!chat.boardId) {
              if(chat.boardId === obj.boardId) {
                chat.messages = messages;
              }
            } else if(!!chat.directChatId) {
              if(chat.directChatId === obj.directChatId) {
                chat.messages = messages;
              }
            }
          });
        } else {
        // si no existe el boardId o directChatId en el state chats
        // hago un push de los mensajes que me vinieron a un nuevo
        // objeto dentro de chats
          if(obj.boardId != '') {
            chats.push({
              boardId: obj.boardId,
              messages,
            });
          } else if(obj.directChatId != '') {
            chats.push({
              directChatId: obj.directChatId,
              messages,
            });
          }
        }

        this.setState({
          chats: chats,
        });
      },
      onError: (error) => {
        throw new Meteor.Error(error);
      },
    });
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
  };
}, Team);
