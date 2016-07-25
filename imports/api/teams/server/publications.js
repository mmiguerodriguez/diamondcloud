import { Meteor } from 'meteor/meteor';

import { Teams } from '../teams.js';
import { DirectChats } from '../../direct-chats/direct-chats.js';
import { Boards } from '../../boards/boards.js';

Meteor.publish('teams.dashboard', function() {
  if (!Meteor.user()) {
    throw new Meteor.Error('Teams.publication.dashboard.notLoggedIn',
    'Must be logged in to view teams.');
  }

<<<<<<< HEAD
  let teams = Meteor.user().teams({
    fields: Teams.dashboardFields
  });
=======
  let teams = Meteor.user().teams({ 
    fields: Teams.dashboardFields 
  });
  return teams;
>>>>>>> cf69c2e555ff83a34505b061e3a632024bf77ba9
  
  return teams;
});

Meteor.publishComposite('teams.team', function(teamId) {
  if (!Meteor.user()) {
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
<<<<<<< HEAD

          let boards = Boards.find({
            _id: {
              $in: boardsIds
            },
            $or: [
              {
                users: {
                  $elemMatch: {
                    _id: this.userId,
                  }
                }
              },
              {
                isPrivate: false,
              },
            ],
          }, {
            fields: {
              _id: 1,
              name: 1,
            }
          });

=======
          
          let boards = Boards.getBoards(boardsIds, this.userId, { _id: 1, name: 1 });
          
>>>>>>> cf69c2e555ff83a34505b061e3a632024bf77ba9
          return boards;
        },
      },
      {
        find: function(team) {
<<<<<<< HEAD
          let directChats = DirectChats.find({
            teamId,
            users: {
              $elemMatch: {
                _id: this.userId,
              }
            }
          });
          return directChats;
=======
          return DirectChats.getUserDirectChats(this.userId, teamId);
>>>>>>> cf69c2e555ff83a34505b061e3a632024bf77ba9
        }
      },
    ]
  };
});
