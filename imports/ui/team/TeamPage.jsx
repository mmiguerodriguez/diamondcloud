import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import React               from 'react';
import { browserHistory }  from 'react-router';

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
      return ( null );
    } else {
      if(this.props.team) {
        return (
          <TeamLayout
            team={ this.props.team }
            boards={ this.props.boards }
            directChats={ this.props.directChats }
            owner={ this.props.team.owner() === Meteor.user().emails[0].address }
            chats={ this.formatChats() }
            getMessages={ this.getMessages.bind(this) }
            removeChat={ this.removeChat.bind(this) }
          />
        );
      } else {
        return ( null );
      }
    }
  }
  /* todo: Fix when team isn't found (not working)
  componentDidMount() {
    if(this.props.team === undefined) {
      // If team doesn't exists go to a not-found route
      browserHistory.push('/404');
    }
  }
  */
  getMessages(obj) {
    let subscriptions = this.state.subscriptions;
    let isSubscribed = false;

    // Hard check if the subscription exists
    subscriptions.map((sub) => {
      if(sub.boardId && obj.boardId) {
        if(sub.boardId === obj.boardId) {
          isSubscribed = true;
        }
      } else if(sub.directChatId && obj.directChatId) {
        if(sub.directChatId === obj.directChatId) {
          isSubscribed = true;
        }
      }
    });

    if(!isSubscribed) {
      let subscription = Meteor.subscribe('messages.chat', obj, {
        onReady: () => {
          if(obj.boardId) {
            subscriptions.push({ subscription, boardId: obj.boardId });
          } else if(obj.directChatId) {
            subscriptions.push({ subscription, directChatId: obj.directChatId });
          }

          this.setState({
            subscriptions: subscriptions,
          }, () => {
            this.formatChats();
          });
        },
        onError: (error) => {
          throw new Meteor.Error(error);
        }
      });
    }
  }
  formatChats() {
    let chats = [];
    let messages = this.props.messages;

    this.state.subscriptions.map((sub) => {
      if(sub.boardId) {
        chats.push({
          boardId: sub.boardId,
          messages: [],
        });
      } else if(sub.directChatId) {
        chats.push({
          directChatId: sub.directChatId,
          messages: [],
        });
      }
    });

    if(messages.length > 0) {
      messages.map((message) => {
        chats.map((chat) => {
          // Hard check if message in chat exists
          if(chat.directChatId && message.directChatId){
            if(chat.directChatId === message.directChatId) {
              chat.messages.push(message);
            }
          } else if(chat.boardId && message.boardId) {
            if(chat.boardId === message.boardId) {
              chat.messages.push(message);
            }
          }
        });
      });
    }

    return chats;
  }
  removeChat(obj) {
    let subscriptions = this.state.subscriptions;
    if(obj.directChatId) { // check if it is a direct-chat or a board
      subscriptions.map((sub, index) => {
        if(sub.directChatId === obj.directChatId) {
          sub.subscription.stop(); // stop subscription
          subscriptions.splice(index, 1); // remove element from array
        }
      });
    } else if(obj.boardId) {
      subscriptions.map((sub, index) => {
        if(sub.boardId === obj.boardId) {
          sub.subscription.stop();
          subscriptions.splice(index, 1);
        }
      });
    }

    // update state
    this.setState({
      subscriptions: subscriptions,
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
    messages: Messages.find().fetch(),
  };
}, Team);
