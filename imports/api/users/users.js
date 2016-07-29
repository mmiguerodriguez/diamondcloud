import { Mongo } from 'meteor/mongo';

import { Teams } from '../teams/teams.js';

Meteor.users.helpers({
  teams({ fields }) {
    fields = fields || {};

    let teams = Teams.find({

      users: {
        $elemMatch: {
          email: this.emails[0].address,
        }
      },
      archived: false,
    }, { fields }); // translates to -> { fields: { name: 1 } }

    if(teams)
      return teams;
  },
  boards(teamId, fields){
    fields = fields || {};
    let team = Teams.findOne(teamId);
    if(!team){
      throw new Meteor.Error('Users.boards.wrongTeamId',
      'There is no team with the given id');
    }
    if(!team.hasUser(this)){
      throw new Meteor.Error('Users.boards.userNotInTeam',
      'The user is not in the team');
    }
    let boardsIds = [];

    team.boards.forEach((board) => {
      boardsIds.push(board._id);
    });
    let boards = Boards.getBoards(boardsIds, this.userId, {
      _id: 1,
      name: 1
    });
    return boards;
  }
});
