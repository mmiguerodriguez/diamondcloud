import { Meteor }      from 'meteor/meteor';

import { Teams }       from '../teams';
import { Boards }      from '../../boards/boards';
import { Modules }     from '../../modules/modules';
import { DirectChats } from '../../direct-chats/direct-chats';

Meteor.publishComposite('teams.dashboard', function () {
  if (!this.userId) {
    this.stop();
    throw new Meteor.Error('Teams.publication.dashboard.notLoggedIn',
    'Must be logged in to view teams.');
  }

  const user = Meteor.users.findOne(this.userId);
  return {
    find: function() {
      return user.teams({
        fields: Teams.dashboardFields,
      });
    },
    children: [
      {
        find: function(team) {
          return team.getUsers(Teams.dashboardUsersFields);
        },
      },
    ],
  };
});

Meteor.publishComposite('teams.team', function (teamUrl) {
  if (!this.userId) {
    this.stop();
    throw new Meteor.Error('Teams.publication.team.notLoggedIn',
    'Must be logged in to view teams.');
  }

  const user = Meteor.users.findOne(this.userId);
  const teamId = Teams.findOne({ url: teamUrl })._id;

  return {
    find: function () {
      return Teams.getTeam(teamId, user.email(), Teams.teamFields);
    },
    children: [
      {
        find: function (team) {
          return Boards.getBoards(team.boards, this.userId, {
            _id: 1,
            name: 1,
            type: 1,
            users: 1,
            isPrivate: 1,
            visibleForDirectors: 1,
          });
        },
      },
      {
        find: function (team) {
          return DirectChats.getUserDirectChats(this.userId, team._id);
        },
      },
      {
        find: function (team) {
          return team.getUsers(Teams.teamUsersFields);
        }
      },
      {
        find: function () {
          return Modules.find({ validated: true });
        },
      },
    ],
  };
});
