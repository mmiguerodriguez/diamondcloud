import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import React               from 'react';
import { browserHistory }  from 'react-router';

import { Teams }           from '../../api/teams/teams.js';
import { Boards }          from '../../api/boards/boards.js';
import { ModuleInstances } from '../../api/module-instances/module-instances.js';
import { Modules }         from '../../api/modules/modules.js';
import { DirectChats }     from '../../api/direct-chats/direct-chats.js';
import { Messages }        from '../../api/messages/messages.js';

import TeamLayout          from './TeamLayout.jsx';

export default class Team extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriptions: [],
      moduleInstancesFrames: [],
    };
  }
  render() {
    const board = Team.board.get();

    if(this.props.loading) {
      return ( null );
    }

    if(!this.props.team) {
      return ( null );
    }

    if(!board) {
      return ( null );
    }

    return (
      <TeamLayout
        team={ this.props.team }
        owner={ this.props.team.owner() === Meteor.user().email() }

        boards={ this.props.boards }
        board={ board }
        moduleInstances={ this.props.moduleInstances }
        moduleInstancesFrames={ this.state.moduleInstancesFrames }
        modules={ this.props.modules }

        directChats={ this.props.directChats }
        chats={ this.formatChats() }

        getMessages={ this.getMessages.bind(this) }
        removeChat={ this.removeChat.bind(this) }
        boardSubscribe={ this.boardSubscribe.bind(this) } />
    );
  }

  componentDidUpdate() {
    // If it already loaded and team doesn't exist then we
    // should return the user to a NotFound Layout or
    // error route...
    if(!this.props.loading && !this.props.team) {
      browserHistory.push('/404');
    }
  }
  componentWillUnmount() {
    Team.boardSubscription.get().stop();
  }

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

  boardSubscribe(boardId) {
    if(Team.boardSubscription.get()) {
      this.state.moduleInstancesFrames.map((frame) => {
        frame.DiamondAPI.unsubscribe();
      });
      Team.boardSubscription.get().stop(); // Unsubscribe from actual board
    }

    let subscription = Meteor.subscribe('boards.board', boardId, {
      onReady: () => {
        Team.board.set(Boards.findOne(boardId));
      },
      onError: (error) => {
        throw new Meteor.Error(error);
      }
    });

    Team.boardSubscription.set(subscription);
  }
}

Team.board = new ReactiveVar();
Team.boardSubscription = new ReactiveVar();

export default TeamPageContainer = createContainer(({ params }) => {
  const { teamId } = params;
  const teamHandle = Meteor.subscribe('teams.team', teamId, () => {
    let firstBoard = Boards.findOne();
    let boardHandle = Meteor.subscribe('boards.board', firstBoard._id, () => {
      Team.board.set(Boards.findOne());
    });

    Team.boardSubscription.set(boardHandle);
  });
  const loading = !teamHandle.ready();

  return {
    loading,
    team: Teams.findOne(),
    boards: Boards.find({}, { sort: { name: -1 } }).fetch(),
    directChats: DirectChats.find().fetch(),
    messages: Messages.find().fetch(),
    moduleInstances: ModuleInstances.find().fetch(),
    modules: Modules.find({}, { sort: { name: -1 } }).fetch(),
  };
}, Team);
