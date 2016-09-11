import { Meteor }               from 'meteor/meteor';
import { ValidatedMethod }      from 'meteor/mdg:validated-method';
import { SimpleSchema }         from 'meteor/aldeed:simple-schema';
import  Future                  from 'fibers/future';
import { Mail }                 from '../mails/mails.js';

import { Teams }                from './teams.js';
import { Boards }               from '../boards/boards.js';
import { createBoard }          from '../boards/methods.js';
import { createModuleData }     from '../module-data/module-data.js';

export const createTeam = new ValidatedMethod({
  name: 'Teams.methods.create',
  validate: new SimpleSchema({
    name: { type: String },
    plan: { type: String, allowedValues: ['free', 'premium'] },
    type: { type: String, min: 0, max: 200 },
    usersEmails: { type: [String] },
  }).validator(),
  run({ name, plan, type, usersEmails }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.create.notLoggedIn',
      'Must be logged in to make a team.');
    }

    let team, teamId, boardUsers = [];

    team = {
      name,
      plan,
      type,
      boards: [],
      users: [
        { email: Meteor.user().emails[0].address, permission: 'owner' }
      ],
      archived: false,
    };

    usersEmails.forEach(function(email) {
      team.users.push({ email, permission: 'member' });
      boardUsers.push({ email });
    });

    let future = new Future(); // Needed to make asynchronous call to db
    Teams.insert(team, (err, res) => {
      if(err) throw new Meteor.Error(err);
      createModuleData();
      teamId = res;
      createBoard.call({
        teamId,
        name: 'General',
        users: boardUsers,
        isPrivate: false,
      }, (err, res) => {
        if(!!err) future.throw(err);

        team.boards.push({ _id: res._id });
        team._id = teamId;
        usersEmails.forEach((email) => {
          if (Meteor.users.findByEmail(email, {}).count() === 0) {
            //if user is not registered in Diamond Cloud
            Mail.sendMail({
              from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
              to: email,
              subject: 'Te invitaron a colaborar en Diamond Cloud',
              text: Mail.messages.sharedTeamNotRegistered(teamId),
            });
          } else {
            Mail.sendMail({
              from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
              to: email,
              subject: 'Te invitaron a colaborar en Diamond Cloud',
              text: Mail.messages.sharedTeamRegistered(teamId),
            });
          }
        });
        future.return(team);
      });
    });

    return future.wait();
  }
});

export const editTeam = new ValidatedMethod({
  name: 'Teams.methods.edit',
  validate: new SimpleSchema({
    'teamId': { type: String },
    'team': { type: Object },
    'team.name': { type: String, optional: true, },
    'team.plan': { type: String, optional: true, allowedValues: ['free', 'premium'] },
    'team.type': { type: String, optional: true, },
  }).validator(),
  run({ team, teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.edit.notLoggedIn',
      'Must be logged in to edit a team.');
    }

    Teams.update({ _id: teamId }, {
      $set: team
    });
    return Teams.findOne(teamId);
  }
});

export const shareTeam = new ValidatedMethod({
  name: 'Teams.methods.share',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    teamId: { type: String }
  }).validator(),
  run({ email, teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.share.notLoggedIn',
      'Must be logged in to edit a team.');
    }
    let team = Teams.findOne(teamId);
    if(Meteor.user().emails[0].address !== team.owner()){
      throw new Meteor.Error('Teams.methods.share.notOwner',
      "Must be team's owner to share");
    }
    let user = { email, permission: 'member' };

    Teams.addUser(teamId, user);
    if(Meteor.users.findByEmail(email, {}).count() === 0) {
      //if user is not registered in Diamond Cloud
      Mail.sendMail({
        from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
        to: email,
        subject: 'Te invitaron a colaborar en Diamond Cloud',
        text: Mail.messages.sharedTeamNotRegistered(teamId),
      });
    } else {
      Mail.sendMail({
        from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
        to: email,
        subject: 'Te invitaron a colaborar en Diamond Cloud',
        text: Mail.messages.sharedTeamRegistered(teamId),
      });
    }
    return Teams.findOne(teamId);
  }
});

export const removeUserFromTeam = new ValidatedMethod({
  name: 'Teams.methods.removeUser',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    teamId: { type: String },
  }).validator(),
  run({ email, teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.removeUser.notLoggedIn',
      'Must be logged in to edit a team.');
    }

    let team = Teams.findOne(teamId);
    let user = Meteor.users.findByEmail(email).fetch()[0];
    if(Meteor.user().emails[0].address !== team.owner()){
      throw new Meteor.Error('Teams.methods.removeUser.notOwner',
      "Must be team's owner to remove user");
    }

    //remove user from boards
    let boards = user.boards(teamId).fetch();
    boards.forEach((board) => {
      Boards.removeUser(board._id, user._id);
    });
    Teams.removeUser(teamId, email);

    return Teams.findOne(teamId);
  }
});

export const archiveTeam = new ValidatedMethod({
  name: 'Teams.methods.archive',
  validate: new SimpleSchema({
    teamId: { type: String },
  }).validator(),
  run({ teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.archive.notLoggedIn',
      'Must be logged in to archive a team.');
    }
    // Verify user is the team owner
    let team = Teams.findOne(teamId);
    if (team.owner() !== Meteor.user().emails[0].address)
      throw new Meteor.Error('Teams.methods.archive.notTeamOwner',
      'Must be the team owner to archive the team.');

    Teams.update(teamId, {
      $set: {
        archived: true,
      }
    });

    // Testing purposes
    // may need to change in the future
    return Teams.findOne(teamId);
  }
});

export const dearchiveTeam = new ValidatedMethod({
  name: 'Teams.methods.dearchive',
  validate: new SimpleSchema({
    teamId: { type: String },
  }).validator(),
  run({ teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.dearchive.notLoggedIn',
      'Must be logged in to archive a team.');
    }

    // Verify user is the team owner
    let team = Teams.findOne(teamId);
    if (team.owner() !== Meteor.user().emails[0].address) {
      throw new Meteor.Error('Teams.methods.dearchive.notTeamOwner',
      'Must be the team owner to archive the team.');
    }

    Teams.update(teamId, {
      $set: {
        archived: false,
      }
    });

    // Testing purposes
    // may need to change in the future
    return Teams.findOne(teamId);
  }
});
