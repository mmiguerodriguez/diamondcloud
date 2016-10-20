import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory }  from 'react-router';

import { Teams }           from '../../api/teams/teams';
import { Boards }          from '../../api/boards/boards';
import { ModuleInstances } from '../../api/module-instances/module-instances';
import { Modules }         from '../../api/modules/modules';
import { DirectChats }     from '../../api/direct-chats/direct-chats';
import { Messages }        from '../../api/messages/messages';

import TeamPage            from './TeamPage';

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
    onReady() {
      
    },
    onError(error) {
      console.log('Error en la subscription de teams.dashboard', error);
    },
  });
  const teamHandle = Meteor.subscribe('teams.team', teamUrl, {
    onReady() {
      const firstBoard = Boards.findOne();
      const boardHandle = Meteor.subscribe('boards.board', firstBoard._id, {
        onReady() {
          TeamPage.boardId.set(firstBoard._id);
        },
        onError(error) {
          console.log('Error en la subscription de boards.board', error);
        },
      });

      TeamPage.boardSubscription.set(boardHandle);
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
  };
}, TeamPage);

export default TeamPageContainer;
