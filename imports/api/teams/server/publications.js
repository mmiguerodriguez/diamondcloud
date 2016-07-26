import { Meteor } from 'meteor/meteor';

import { Teams } from '../teams.js';
import { DirectChats } from '../../direct-chats/direct-chats.js';
import { Boards } from '../../boards/boards.js';

Meteor.publish('teams.dashboard', function() {
  if (!this.userId) {
<<<<<<< HEAD
    throw new Meteor.Error('Teams.publication.dashboard.notLoggedIn',
=======
    throw new Meteor.Error('Teams.publication.dashboard.notLoggedIn', 
>>>>>>> 65397642919bfe413520b003d040fa53642b6239
    'Must be logged in to view teams.');
  }

  let user = Meteor.users.findOne(this.userId);
  let teams = user.teams({
<<<<<<< HEAD
    fields: Teams.dashboardFields,
=======
    fields: Teams.dashboardFields
>>>>>>> 65397642919bfe413520b003d040fa53642b6239
  });

  return teams;
});

Meteor.publishComposite('teams.team', function(teamId) {
  if (!this.userId) {
    throw new Meteor.Error('Teams.publication.team.notLoggedIn',
    'Must be logged in to view teams.');
  }

  return {
    find: function() {
      return Teams.find(teamId, {
        fields: Teams.teamFields,
      });
    },
    children: [
      {
        find: function(team) {
          let boardsIds = [];

          team.boards.forEach((board) => {
            boardsIds.push(board._id);
          });

          let boards = Boards.getBoards(boardsIds, this.userId, {
            _id: 1,
            name: 1
          });
          return boards;
        },
      },
      {
        find: function(team) {
          return DirectChats.getUserDirectChats(this.userId, teamId);
        }
      },
    ]
  };
});
