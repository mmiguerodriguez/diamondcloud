import { Meteor }          from 'meteor/meteor';
import { ReactiveVar }     from 'meteor/reactive-var';

import React               from 'react';
import { browserHistory }  from 'react-router';
import isMobile            from 'ismobilejs';

import { Boards }          from '../../api/boards/boards';
import { DirectChats }     from '../../api/direct-chats/direct-chats';

import NotificationSystem  from '../notifications/notificationSystem/NotificationSystem';
import TeamLayout          from './TeamLayout';

export default class TeamPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      moduleInstancesFrames: [],
    };

    this.openHiddenChat = this.openHiddenChat.bind(this);
    this.addChat = this.addChat.bind(this);
    this.removeChat = this.removeChat.bind(this);
    this.boardSubscribe = this.boardSubscribe.bind(this);
  }

  componentDidUpdate() {
    /**
     * If it already loaded and team doesn't exist then we
     * should return the user to a NotFound Layout or
     * error route...
     */
    if (!this.props.loading && !this.props.team) {
      browserHistory.push('/404');
    }
  }

  componentWillUnmount() {
    if (TeamPage.boardSubscription.get()) {
      TeamPage.boardSubscription.get().stop();
    }
  }
  /**
   * Iterates through all the chats, grabs its messages and
   * returns them as props for TeamLayout.
   *
   * @returns {Object} chats
   */
  getChats() {
    let { chats } = this.state;

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
   *
   * @param {Object} obj
   *  @param {String} boardId (optional)
   *  @param {String} directChatId (optional)
   */
  addChat(obj) {
    const self = this;

    let { chats } = this.state;

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

            chats = [{
              boardId: obj.boardId,
              messages,
              subscription: chatHandle,
            }, ...chats];

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

            chats = [{
              directChatId: obj.directChatId,
              messages,
              subscription: chatHandle,
            }, ...chats];

            self.setState({
              chats,
            });
          },
        });
      }
    }
  }
  /**
   * Moves the chat with the passed index to the
   * first position of the chats array.
   * 
   * @param {Number} index
   *   The actual index of the chat in the
   *   chats array.
   */
  openHiddenChat(index) {
    /**
     * Moves the passed array index from one place
     * to another.
     * 
     * @param {Array} array
     * @param {Number} oldIndex
     * @param {Number} newIndex
     */
    const move = (array, oldIndex, newIndex) => {
      while (oldIndex < 0) {
        oldIndex += array.length;
      }

      while (newIndex < 0) {
        newIndex += array.length;
      }

      if (newIndex >= array.length) {
        let k = newIndex - array.length;
        while ((k--) + 1) {
          array.push(undefined);
        }
      }

      array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
      return array;
    };
    const NEW_INDEX = 0;

    let { chats } = this.state;
    
    chats = move(chats, index, NEW_INDEX);
    
    this.setState({
      chats,
    });
  }
  /**
   * Removes the chat with boardId || directChatId from
   * the chats array that is in the state and stops
   * its subscription.
   *
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
   *
   * @param {String} boardId
   */
  boardSubscribe(boardId) {
    const self = this;

    if (TeamPage.boardId.get() === boardId) {
      return;
    }

    if (TeamPage.boardSubscription.get()) {
      this.state.moduleInstancesFrames.forEach((frame) => {
        frame.DiamondAPI.unsubscribe();
      });

      TeamPage.boardSubscription.get().stop();
    }

    const subscription = Meteor.subscribe('boards.board', boardId, {
      onReady() {
        TeamPage.boardId.set(boardId);
      },
      onError(error) {
        self.props.toggleError({
          type: 'show',
          body: 'Hubo un error interno al entrar al board',
        });
      },
    });

    TeamPage.boardSubscription.set(subscription);
  }

  render() {
    if (!TeamPage.boardId.get()) {
      return null;
    }

    const board = Boards.findOne(TeamPage.boardId.get());

    if (this.props.loading) {
      return (
        <div className='loading'>
          <div className='loader'></div>
        </div>
      );
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
          openHiddenChat={this.openHiddenChat}
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

TeamPage.boardId = new ReactiveVar();
TeamPage.boardSubscription = new ReactiveVar();
TeamPage.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  team: React.PropTypes.object,
  teams: React.PropTypes.array.isRequired,
  users: React.PropTypes.array.isRequired,
  boards: React.PropTypes.array.isRequired,
  directChats: React.PropTypes.array.isRequired,
  messages: React.PropTypes.array.isRequired,
  moduleInstances: React.PropTypes.array.isRequired,
  modules: React.PropTypes.array.isRequired,
  toggleError: React.PropTypes.func.isRequired,
};
