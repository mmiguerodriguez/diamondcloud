import { Meteor }          from 'meteor/meteor';
import { ReactiveVar }     from 'meteor/reactive-var'
import { createContainer } from 'meteor/react-meteor-data';

import React               from 'react';
import { browserHistory }  from 'react-router';
import isMobile            from 'ismobilejs';

import { Teams }           from '../../api/teams/teams';
import { Boards }          from '../../api/boards/boards';
import { ModuleInstances } from '../../api/module-instances/module-instances';
import { Modules }         from '../../api/modules/modules';
import { DirectChats }     from '../../api/direct-chats/direct-chats';
import { Messages }        from '../../api/messages/messages';

import TeamLayout          from './TeamLayout';
import NotificationSystem  from '../notifications/notificationSystem/NotificationSystem';

export class Team extends React.Component {
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
  /**
   * Iterates through all the chats, grabs its messages and
   * returns them as props for TeamLayout.
   */
  getChats() {
    let chats = this.state.chats;

    chats = chats.map((chat) => {
      if (chat.boardId) {
        chat.messages = Boards.findOne(chat.boardId).getMessages().fetch();
      } else {
        chat.messages = DirectChats.findOne(chat.directChatId).getMessages().fetch();
      }
      return chat;
    });

    return chats;
  }
  /**
   * Adds a chat to the chats array, gets the messages and
   * updates the chats state.
   * @param {Object} obj
   *  @param {String} boardId (optional)
   *  @param {String} directChatId (optional)
   */
  addChat(obj) {
    const self = this;

    const { chats } = this.state;

    if (obj.boardId) {
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
            const messages = Boards.findOne(obj.boardId).getMessages().fetch();

            chats.push({
              boardId: obj.boardId,
              messages,
              subscription: chatHandle,
            });

            self.setState({
              chats,
            });
          },
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
            const messages = DirectChats.findOne(obj.directChatId).getMessages().fetch();

            chats.push({
              directChatId: obj.directChatId,
              messages,
              subscription: chatHandle,
            });

            self.setState({
              chats,
            });
          },
        });
      }
    }
  }
  /**
   * Removes the chat with boardId || directChatId from
   * the chats array that is in the state and stops
   * its subscription.
   * @param {Object} obj
   *  @param {String} boardId (optional)
   *  @param {String} directChatId (optional)
   */
  removeChat(obj) {
    let { chats } = this.state;

    if (obj.boardId) {
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
  /**
   * Subscribes to the whole data of a board.
   * If we are already subscribed, then we
   * unsubscribe.
   * @param {String} boardId
   */
  boardSubscribe(boardId) {
    const self = this;

    if (Team.boardId.get() === boardId) {
      return;
    }

    if (Team.boardSubscription.get()) {
      this.state.moduleInstancesFrames.forEach((frame) => {
        frame.DiamondAPI.unsubscribe();
      });

      Team.boardSubscription.get().stop();
    }

    const subscription = Meteor.subscribe('boards.board', boardId, {
      onReady() {
        Team.boardId.set(boardId);
      },
      onError(error) {
        self.props.toggleError({
          type: 'show',
          body: 'Hubo un error interno al entrar al board',
        });
      },
    });

    Team.boardSubscription.set(subscription);
  }

  render() {
    if (!Team.boardId.get()) {
      return null;
    }

    const board = Boards.findOne(Team.boardId.get());

    if (this.props.loading) {
      return null;
    }

    if (this.props.team === undefined) {
      return null;
    }

    if (!board) {
      return null;
    }

    return (
      <div>
        <TeamLayout
          teams={this.props.teams}
          team={this.props.team}
          users={this.props.users}
          isAdmin={this.props.team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')}

          boards={this.props.boards}
          board={board}

          modules={this.props.modules}
          moduleInstances={this.props.moduleInstances}
          moduleInstancesFrames={this.state.moduleInstancesFrames}

          directChats={this.props.directChats}
          chats={this.getChats()}

          addChat={this.addChat}
          removeChat={this.removeChat}
          boardSubscribe={this.boardSubscribe}
          toggleError={this.props.toggleError}
        />
        {
          !isMobile.any ? (
            <NotificationSystem
              messages={this.props.messages}
            />
          ) : (null)
        }
      </div>
    );
  }
}

Team.boardId = new ReactiveVar();
Team.boardSubscription = new ReactiveVar();

export default TeamPageContainer = createContainer(({ params }) => {
  if (!Meteor.user()) {
    browserHistory.push('/');
  }

  const { teamUrl } = params;

  let messagesHandle;
  const changesCallback = () => {
    if (messagesHandle) {
      messagesHandle.stop();
    }

    messagesHandle = Meteor.subscribe('messages.last', teamUrl);
  };

  const teamsHandle = Meteor.subscribe('teams.dashboard');
  const teamHandle = Meteor.subscribe('teams.team', teamUrl, () => {
    const firstBoard = Boards.findOne();
    const boardHandle = Meteor.subscribe('boards.board', firstBoard._id, () => {
      Team.boardId.set(Boards.findOne()._id);
    });

    Team.boardSubscription.set(boardHandle);
    messagesHandle = Meteor.subscribe('messages.last', teamUrl);
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
    team: Teams.findOne({ url: teamUrl }),
    teams: Teams.find({}, { sort: { name: -1 } }).fetch(),
    users: Meteor.users.find({}).fetch(),
    boards: Boards.find({}, { sort: { name: -1 } }).fetch(),
    directChats: DirectChats.find().fetch(),
    messages: Messages.find({}).fetch(),
    moduleInstances: ModuleInstances.find({}).fetch(),
    modules: Modules.find({}, { sort: { name: -1 } }).fetch(),
  };
}, Team);
