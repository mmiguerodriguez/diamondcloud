import { Meteor }          from 'meteor/meteor';
import { ReactiveVar }     from 'meteor/reactive-var';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory }  from 'react-router';

import { Teams }           from '../../api/teams/teams';
import { Boards }          from '../../api/boards/boards';
import { ModuleInstances } from '../../api/module-instances/module-instances';
import { Modules }         from '../../api/modules/modules';
import { DirectChats }     from '../../api/direct-chats/direct-chats';
import { Messages }        from '../../api/messages/messages';

import hierarchyToType     from '../helpers/hierarchyToType';
import TeamPage            from './TeamPage';

const boardId = new ReactiveVar('');
const boardSubscription = new ReactiveVar({});

const setBoardId = value => boardId.set(value);
const setBoardSubscription = value => boardSubscription.set(value);

const TeamPageContainer = createContainer(({ params }) => {
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

  const teamsHandle = Meteor.subscribe('teams.dashboard', {
    onError(error) {
      console.log('Error en la subscription de teams.dashboard', error);
    },
  });
  const teamHandle = Meteor.subscribe('teams.team', teamUrl, {
    onReady() {
      /**
       * Get the team and hierarchy of the user to find a
       * board with the same type/hierarchy
       *
       * If team isn't found, we return the user to a
       * not found page
       */
      const team = Teams.findOne({ url: teamUrl });
      if (!team) {
        browserHistory.push('/404');
        return;
      }

      const hierarchy = team.userHierarchy(Meteor.user().email());
      const type = hierarchyToType(hierarchy);

      /**
       * Check if there is a board with the user hierarchy
       */
      let board = Boards.findOne({ type });
      /**
       * If this board doesn't exist, we check again if there
       * is any board which the user can access
       */
      if (!board) {
        board = Boards.findOne();
        /**
         * If we don't find any board, then we show the user
         * a not found page since he can't see any board
         */
        if (!board) {
          browserHistory.push('/404');
          return;
        }
      }

      console.log('First Board', board._id);
      const boardHandle = Meteor.subscribe('boards.board', board._id, {
        onReady() {
          console.log('Setting boardId, ', board._id);
          setBoardId(board._id);
          console.log('boardId set is', boardId.get());
        },
        onError(error) {
          console.log('Error en la subscription de boards.board', error);
        },
      });

      setBoardSubscription(boardHandle);
      messagesHandle = Meteor.subscribe('messages.last', teamUrl);

      /**
       * Subscribe again to the messages.last collection since
       * new DirectChats or Boards where found on the
       * database.
       */
      DirectChats.find().observeChanges({
        added: changesCallback,
        removed: changesCallback,
      });
      Boards.find().observeChanges({
        added: changesCallback,
        removed: changesCallback,
      });
    },
    onError(error) {
      console.log('Error en la subscription de teams.team', error);
    },
  });
  const loading = !teamHandle.ready() || !teamsHandle.ready();

  return {
    loading,
    team: !loading ? Teams.findOne({ url: teamUrl }) : {},
    teams: !loading ? Teams.find({}, { sort: { name: -1 } }).fetch() : [],
    users: !loading ? Meteor.users.find({}).fetch() : [],
    boards: !loading ? Boards.find({}, { sort: { name: -1 } }).fetch() : [],
    directChats: !loading ? DirectChats.find().fetch() : [],
    messages: !loading ? Messages.find({}).fetch() : [],
    moduleInstances: !loading ? ModuleInstances.find({}).fetch() : [],
    modules: !loading ? Modules.find({}, { sort: { name: -1 } }).fetch() : [],
    boardId: boardId.get(),
    boardSubscription: boardSubscription.get(),
    setBoardId,
    setBoardSubscription,
  };
}, TeamPage);


export default TeamPageContainer;
