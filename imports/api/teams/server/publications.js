import { Meteor } from 'meteor/meteor';

import { Teams } from '../teams.js';
import { DirectChats } from '../../direct-chats/direct-chats.js';
import { Boards } from '../../boards/boards.js';

Meteor.publishComposite('teams.dashboard', function() {
  if (!this.userId) {
    throw new Meteor.Error('Teams.publication.dashboard.notLoggedIn',
    'Must be logged in to view teams.');
  }

  let user = Meteor.users.findOne(this.userId);
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
        }
      }
    ]
  };
});

Meteor.publishComposite('teams.team', function(teamId) {
  if (!this.userId) {
    throw new Meteor.Error('Teams.publication.team.notLoggedIn',
    'Must be logged in to view teams.');
  }

  let user = Meteor.users.findOne(this.userId);
  return {
    find: function() {
      return Teams.getTeam(teamId, user.emails[0].address, Teams.teamFields);
    },
    children: [
      {
        find: function(team) {
          return Boards.getBoards(team.boards, this.userId, {
            _id: 1,
            name: 1
          });
        },
      },
      {
        find: function(team) {
          return DirectChats.getUserDirectChats(this.userId, teamId);
        }
      },
      {
        find: function(team) {
          return team.getUsers(Teams.teamUsersFields);
        }
      }
    ]
  };
});
