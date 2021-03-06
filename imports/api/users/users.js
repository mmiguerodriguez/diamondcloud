import { Mongo }       from 'meteor/mongo';

import { Teams }       from '../teams/teams.js';
import { Boards }      from '../boards/boards.js';
import { DirectChats } from '../direct-chats/direct-chats.js';

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
    }, {
      fields,
    });

    if (teams)
      return teams;
  },
  boards(teamId, fields) {
    fields = fields || {};
    let team = Teams.findOne(teamId);
    if (!team) {
      throw new Meteor.Error('Users.boards.wrongTeamId',
      'There is no team with the given id');
    }
    if (!team.hasUser({ _id: this._id })) {
      throw new Meteor.Error('Users.boards.userNotInTeam',
      'The user is not in the team');
    }
    return Boards.getBoards(team.boards, this._id);
  },
  email() {
    return this.emails[0].address;
  }
});

Meteor.users.dashboardFields = {
  profile: 1,
  emails: 1,
};

Meteor.users.findByEmail = (emails, fields) => {
  if (typeof emails === 'string') {
    return Meteor.users.findOne({ 'emails.address': emails }, { fields });
  }

  return Meteor.users.find({
    'emails.address': {
      $in: emails,
    },
  }, { fields });
};

Meteor.users.deny({
  update() { return true; }
});
