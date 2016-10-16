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

  const teamsHandle = Meteor.subscribe('teams.dashboard');
  const teamHandle = Meteor.subscribe('teams.team', teamUrl, () => {
    const firstBoard = Boards.findOne();
    const boardHandle = Meteor.subscribe('boards.board', firstBoard._id, () => {
      TeamPage.boardId.set(Boards.findOne()._id);
    });

    TeamPage.boardSubscription.set(boardHandle);
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
}, TeamPage);

export default TeamPageContainer;
