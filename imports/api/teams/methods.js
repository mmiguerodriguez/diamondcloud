import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Future from 'fibers/future';

import { Teams } from './teams.js';
import { createBoard } from '../boards/methods.js';

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

    let team,
        teamId;

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
    });

    let future = new Future(); // Needed to make asynchronous call to db
    Teams.insert(team, (err, res) => {
      if(err) throw new Meteor.Error(err);

      teamId = res;
      createBoard.call({
        name: 'General',
        isPrivate: false,
        teamId,
      }, (err, res) => {
        if(!!err) future.throw(err);

        team.boards.push({ _id: res._id });
        team._id = teamId;

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

    // Testing purposes
    // may need to change in the future
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

    // Testing purposes
    // may need to change in the future
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
    let user = Meteor.users.findByEmail(email, {});
    if(Meteor.user().emails[0].address !== team.owner()){
      throw new Meteor.Error('Teams.methods.removeUser.notOwner',
      "Must be team's owner to remove user");
    }

    //remove user from boards
    console.log(user);//todo: agregar en el testeo boards
    let boards = user.boards(teamId, {});
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
