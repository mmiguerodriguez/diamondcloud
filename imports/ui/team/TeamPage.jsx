import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import React               from 'react';
import { browserHistory }  from 'react-router';
import isMobile            from 'ismobilejs';

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

    this.addChat = this.addChat.bind(this);
    this.removeChat = this.removeChat.bind(this);
    this.boardSubscribe = this.boardSubscribe.bind(this);
  }
  render() {
    const board = Team.board.get();

    if (this.props.loading) {
      return ( null );
    }

    if (this.props.team === undefined) {
      return ( null );
    }

    if (!board) {
      return ( null );
    }

    return (
      <div>
        <TeamLayout
          teams={ this.props.teams }
          team={ this.props.team }
          users={ this.props.users }
          owner={ this.props.team.owner() === Meteor.user().email() }

          boards={ this.props.boards }
          board={ board }

          modules={ this.props.modules }
          moduleInstances={ this.props.moduleInstances }
          moduleInstancesFrames={ this.state.moduleInstancesFrames }

          directChats={ this.props.directChats }
          chats={ this.getChats() }

          addChat={ this.addChat }
          removeChat={ this.removeChat }
          boardSubscribe={ this.boardSubscribe } />
        {
          !isMobile.any ? (
            <NotificationSystem
              messages={ this.props.messages } />
          ) : ( null )
        }
      </div>
    );
  }

  componentDidUpdate() {
    // If it already loaded and team doesn't exist then we
    // should return the user to a NotFound Layout or
    // error route...
    if (!this.props.loading && !this.props.team) {
      browserHistory.push('/404');
    }
  }
  componentWillUnmount() {
    if (Team.boardSubscription.get()) {
      Team.boardSubscription.get().stop();
    }
  }

  getChats() {
    let chats = this.state.chats;

    chats = chats.map((chat) => {
      if (!!chat.boardId) {
        chat.messages = Boards.findOne(chat.boardId).getMessages().fetch();
      } else {
        chat.messages = DirectChats.findOne(chat.directChatId).getMessages().fetch();
      }
      return chat;
    });

    return chats;
  }
  addChat(obj) {
    let self = this;
    let { chats } = this.state;

    if (!!obj.boardId) {
      let found = false;
      chats.forEach((chat) => {
        if (chat.boardId === obj.boardId) {
          found = true;
        }
      });

      if (!found) {
        const chatHandle = Meteor.subscribe('messages.chat', {
          boardId: obj.boardId,
        }, {
          onReady() {
            let messages = Boards.findOne(obj.boardId).getMessages().fetch();

            chats.push({
              boardId: obj.boardId,
              messages,
              subscription: chatHandle,
            });

            self.setState({
              chats,
            });
          }
        });
      }
    } else {
      let found = false;
      chats.forEach((chat) => {
        if (chat.directChatId === obj.directChatId) {
          found = true;
        }
      });

      if (!found) {
        const chatHandle = Meteor.subscribe('messages.chat', {
          directChatId: obj.directChatId,
        }, {
          onReady() {
            let messages = DirectChats.findOne(obj.directChatId).getMessages().fetch();

            chats.push({
              directChatId: obj.directChatId,
              messages,
              subscription: chatHandle,
            });

            self.setState({
              chats,
            });
          }
        });
      }
    }
  }
  /**
   * removeChat(obj)
   * @param {Object} obj
   *  @param {String} boardId
   *  @param {String} directChatId
   *
   * Removes the chat with boardId || directChatId from
   * the chats array that is in the state and stops
   * its subscription.
   */
  removeChat(obj) {
    let { chats } = this.state;

    if (!!obj.boardId) {
      chats.forEach((chat, index) => {
        if (chat.boardId === obj.boardId) {
          chat.subscription.stop();
          chats.splice(index, 1);
        }
      });
    } else {
      chats.forEach((chat, index) => {
        if (chat.directChatId === obj.directChatId) {
          chat.subscription.stop();
          chats.splice(index, 1);
        }
      });
    }

    this.setState({
      chats,
    });
  }

  boardSubscribe(boardId) {
    if (Team.board.get()._id === boardId) {
      return;
    }

    if (Team.boardSubscription.get()) {
      this.state.moduleInstancesFrames.map((frame) => {
        frame.DiamondAPI.unsubscribe();
      });
      Team.boardSubscription.get().stop(); // Unsubscribe from actual board
    }

    let subscription = Meteor.subscribe('boards.board', boardId, {
      onReady() {
        Team.board.set(Boards.findOne(boardId));
      },
      onError(error) {
        console.error(error);
      }
    });

    Team.boardSubscription.set(subscription);
  }
}

Team.board = new ReactiveVar();
Team.boardSubscription = new ReactiveVar();

export default TeamPageContainer = createContainer(({ params }) => {
  if (!Meteor.user()) {
    browserHistory.push('/');
  }

  const { teamId } = params;
  let messagesHandle;
  let changesCallback = () => {
    if (messagesHandle) {
      messagesHandle.stop();
    }

    messagesHandle = Meteor.subscribe('messages.last', teamId);
  };

  const teamsHandle = Meteor.subscribe('teams.dashboard');
  const teamHandle = Meteor.subscribe('teams.team', teamId, () => {
    let firstBoard = Boards.findOne();
    let boardHandle = Meteor.subscribe('boards.board', firstBoard._id, () => {
      Team.board.set(Boards.findOne());
    });
    Team.boardSubscription.set(boardHandle);
    messagesHandle = Meteor.subscribe('messages.last', teamId);
  });
  const loading = !teamsHandle.ready() || !teamHandle.ready();

  // Get the messages of newly created chats
  DirectChats.find().observeChanges({
    added: changesCallback,
    removed: changesCallback,
  });
  Boards.find().observeChanges({
    added: changesCallback,
    removed: changesCallback,
  });

  return {
    loading,
    team: Teams.findOne(teamId),
    teams: Teams.find({}, { sort: { name: - 1 } }).fetch(),
    users: Meteor.users.find({}).fetch(),
    boards: Boards.find({}, { sort: { name: -1 } }).fetch(),
    directChats: DirectChats.find().fetch(),
    messages: Messages.find({}).fetch(),
    moduleInstances: ModuleInstances.find({}).fetch(),
    modules: Modules.find({}, { sort: { name: -1 } }).fetch(),
  };
}, Team);
