import { Meteor }          from 'meteor/meteor';

import React               from 'react';
import { browserHistory }  from 'react-router';
import isMobile            from 'ismobilejs';

import { Boards }          from '../../api/boards/boards';
import { DirectChats }     from '../../api/direct-chats/direct-chats';

import preloadImages       from '../preloadImages';
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
    this.togglePosition = this.togglePosition.bind(this);
  }

  componentWillMount() {
    preloadImages();
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
  /**
   * Iterates through all the chats, grabs its messages and
   * returns them as props for TeamLayout.
   *
   * @returns {Object} chats
   */
  getChats() {
    const { chats } = this.state;

    chats.map((chat, index) => {
      if (chat.boardId) {
        chats[index].messages = Boards.findOne(chat.boardId).getMessages().fetch();
      } else {
        chats[index].messages = DirectChats.findOne(chat.directChatId).getMessages().fetch();
      }

      chats[index].position = chat.position || (isMobile.any ? 'mobile' : 'medium');

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
              position: isMobile.any ? 'mobile' : 'medium',
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
              position: isMobile.any ? 'mobile' : 'medium',
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
    const { chats } = this.state;

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
   * unsubscribe and subscribe to the
   * new board.
   *
   * @param {String} boardId
   */
  boardSubscribe(boardId) {
    const self = this;

    if (this.props.boardId === boardId) {
      return;
    }

    if (this.props.boardSubscription) {
      this.state.moduleInstancesFrames.forEach((frame) => {
        frame.DiamondAPI.unsubscribe();
      });

      this.props.boardSubscription.stop();
    }

    const subscription = Meteor.subscribe('boards.board', boardId, {
      onReady() {
        self.props.setBoardId(boardId);
      },
      onError() {
        self.props.toggleError({
          type: 'show',
          body: 'Hubo un error interno al entrar al board',
        });
      },
    });

    this.props.setBoardSubscription(subscription);
  }
  /**
   * Toggles the position of the chat.
   * @param {Number} index
   *   The index of the chat in the chats
   *   array.
   * @param {String} position
   *   The position we want to set to the
   *   chat.
   */
  togglePosition(index, position) {
    const { chats } = this.state;

    chats[index].position = position;

    this.setState({
      chats,
    });
  }

  render() {
    const self = this;

    if (!this.props.boardId) {
      console.log('error', 1);
      return null;
    }

    if (this.props.team === undefined) {
      console.log('error', 2);
      return null;
    }

    if (this.props.loading) {
      console.log('error', 3);
      return (
        <div className="loading">
          <div className="loader" />
        </div>
      );
    }

    const board = Boards.findOne(this.props.boardId);
    const _board = Boards.findOne();

    if (!board) {
      console.log('no hay board');
      if (_board) {
        console.log('hay un board existente', Boards.findOne(_board._id).name);
        this.props.setBoardId(_board._id);
        this.props.boardSubscription.stop();

        const boardSubscription = Meteor.subscribe('boards.board', _board._id, {
          onReady() {
            self.props.setBoardSubscription(boardSubscription);
          },
          onStop() {
            console.log('wtf');
          }
        });

        this.props.setBoardSubscription(boardSubscription);
      } else {
        console.log('error', 4);
        return (
          <div>
            <p>
              <a href="">No hay ningun board, rip</a>
            </p>
          </div>
        );
      }
    }

    console.log('no hay error');

    return (
      <div>
        <TeamLayout
          teams={this.props.teams}
          team={this.props.team}
          users={this.props.users}
          isAdmin={this.props.team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')}

          boards={this.props.boards}
          board={board || _board}

          modules={this.props.modules}
          moduleInstances={this.props.moduleInstances}
          moduleInstancesFrames={this.state.moduleInstancesFrames}

          directChats={this.props.directChats}
          chats={this.getChats()}

          addChat={this.addChat}
          openHiddenChat={this.openHiddenChat}
          removeChat={this.removeChat}
          boardSubscribe={this.boardSubscribe}
          togglePosition={this.togglePosition}

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
  boardId: React.PropTypes.string.isRequired,
  boardSubscription: React.PropTypes.object.isRequired,
  setBoardId: React.PropTypes.func.isRequired,
  setBoardSubscription: React.PropTypes.func.isRequired,
};
