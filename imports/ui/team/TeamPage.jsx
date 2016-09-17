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
import NotificationSystem  from '../notifications/notificationSystem/NotificationSystem.jsx';

export default class Team extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
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
      <div>
        <TeamLayout
          team={ this.props.team }
          owner={ this.props.team.owner() === Meteor.user().email() }

          boards={ this.props.boards }
          board={ board }
          moduleInstances={ this.props.moduleInstances }
          moduleInstancesFrames={ this.state.moduleInstancesFrames }
          modules={ this.props.modules }

          directChats={ this.props.directChats }
          chats={ this.getChats() }

          addChat={ this.addChat.bind(this) }
          removeChat={ this.removeChat.bind(this) }
          boardSubscribe={ this.boardSubscribe.bind(this) } />
        <NotificationSystem
          messages={ this.props.messages } />
      </div>
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
    if(Team.boardSubscription.get()) {
      Team.boardSubscription.get().stop();
    }
  }
  getChats() {
    let chats = this.state.chats;
    chats = chats.map((chat) => {
      if(!!chat.boardId) {
        chat.messages = Boards.findOne(chat.boardId).getMessages().fetch();
      } else {
        chat.messages = DirectChats.findOne(chat.directChatId).getMessages().fetch();
      }
      return chat;
    });
    return chats;
  }
  addChat(obj) {
    //obj: { boardId || directChatId }
    let chats = this.state.chats;
    if(!!obj.boardId) {
      let found = false;
      chats.forEach((chat) => {
        if(chat.boardId === obj.boardId) {
          found = true;
        }
      });
      if(!found) {
        let messages = Boards.findOne(obj.boardId).getMessages().fetch();
        chats.push({
          boardId: obj.boardId,
          messages
        });
      }
    } else {
      let found = false;
      chats.forEach((chat) => {
        if(chat.directChatId === obj.directChatId) {
          found = true;
        }
      });
      if(!found) {
        let messages = DirectChats.findOne(obj.directChatId).getMessages().fetch();
        chats.push({
          directChatId: obj.directChatId,
          messages
        });
      }
    }
    this.setState({
      chats
    });
  }
  removeChat(obj) {
    //obj: { boardId || directChatId }
    let chats = this.state.chats;
    if(!!obj.boardId) {
      chats.forEach((chat, index) => {
        if(chat.boardId === obj.boardId) {
          chats.splice(index, 1);
        }
      });
    } else {
      chats.forEach((chat, index) => {
        if(chat.directChatId === obj.directChatId) {
          chats.splice(index, 1);
        }
      });
    }
    this.setState({
      chats
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
  if(!Meteor.user()) {
    browserHistory.push('/');
  }

  const { teamId } = params;
  let messagesHandle;
  const teamHandle = Meteor.subscribe('teams.team', teamId, () => {
    let firstBoard = Boards.findOne();
    let boardHandle = Meteor.subscribe('boards.board', firstBoard._id, () => {
      Team.board.set(Boards.findOne());
    });
    Team.boardSubscription.set(boardHandle);
    messagesHandle = Meteor.subscribe('messages.all', teamId);
  });
  const loading = !teamHandle.ready();
  DirectChats.find().observeChanges({//This is to get the messages of newly created chats
    added: () => {
      messagesHandle = Meteor.subscribe('messages.all', teamId);
    },
    removed: () => {
      messagesHandle = Meteor.subscribe('messages.all', teamId);
    }
  });
  Boards.find().observeChanges({//This is to get the messages of newly created chats
    added: () => {
      messagesHandle = Meteor.subscribe('messages.all', teamId);
    },
    removed: () => {
      messagesHandle = Meteor.subscribe('messages.all', teamId);
    }
  });
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
