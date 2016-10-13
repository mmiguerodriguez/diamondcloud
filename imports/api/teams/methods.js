import { Meteor }               from 'meteor/meteor';
import { ValidatedMethod }      from 'meteor/mdg:validated-method';
import { SimpleSchema }         from 'meteor/aldeed:simple-schema';
import  Future                  from 'fibers/future';
import { Mail }                 from '../mails/mails.js';

import { Teams }                from './teams.js';
import { Boards }               from '../boards/boards.js';
import { createBoard }          from '../boards/methods.js';
import { createModuleInstance } from '../module-instances/methods.js';
import { createModuleData }     from '../module-data/module-data-creation.js';
import { apiInsert }            from '../api/methods.js';

export const createTeam = new ValidatedMethod({
  name: 'Teams.methods.create',
  validate: new SimpleSchema({
    name: { type: String },
    plan: { type: String, allowedValues: ['free', 'premium'] },
    type: { type: String, min: 0, max: 200 },
    users: { type: [Object], blackbox: true, }, // [{ email, hierarchy }]
  }).validator(),
  run({ name, plan, type, users }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.create.notLoggedIn',
      'Must be logged in to make a team.');
    }

    let team, teamId;
    team = {
      name,
      plan,
      type,
      boards: [],
      users: [
        { email: Meteor.user().email(), hierarchy: 'sistemas' }
      ],
      archived: false,
    };

    users.forEach(({ email, hierarchy }) => {
      if (email === Meteor.user().email()) {
        throw new Meteor.Error('Teams.methods.create.emailIsActualUser',
        'You can\'t add yourself to a team',
        'user_adds_himself');
      }

      team.users.push({ email, hierarchy });
    });

    let future = new Future(); // Needed to make asynchronous call to db
    Teams.insert(team, (err, res) => {
      if (err) throw new Meteor.Error(err);

      createModuleData(); // Creates the data storages for each module
      teamId = res;
      team._id = teamId;

      createBoard.call({
        teamId,
        name: 'General',
        type: 'default',
        isPrivate: false,
      }, (err, res) => {
        if (!!err) {
          future.throw(err);
        }

        team.boards.push({ _id: res._id });
        users.forEach(({ email }) => {
          if (Meteor.users.findByEmail(email, {})) {
            // If user is not registered in Diamond Cloud
            Mail.sendMail({
              from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
              to: email,
              subject: 'Te invitaron a colaborar en Diamond Cloud',
              html: Mail.messages.sharedTeamRegistered(teamId),
            });
          } else {
            Mail.sendMail({
              from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
              to: email,
              subject: 'Te invitaron a colaborar en Diamond Cloud',
              html: Mail.messages.sharedTeamNotRegistered(teamId),
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

export const changeUserHierarchy = new ValidatedMethod({
  name: 'Teams.methods.changeUserHierarchy',
  validate: new SimpleSchema({
    teamId: { type: String },
  	userEmail: { type: String },
  	hierarchy: { type: String, allowedValues: [
      'sistemas',
      'creativo',
      'director creativo',
      'director de cuentas',
      'coordinador',
      'administrador',
      'medios',
    ] },
  }).validator(),
  run({ teamId, userEmail, hierarchy }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.changeUserHierarchy.notLoggedIn',
      'Must be logged in to edit a team.');
    }

    let team = Teams.findOne(teamId);
    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.changeUserHierarchy.notAllowed',
      "The user is not allowed to change the hierarchy of another user.");
    }

    Teams.update({
      _id: teamId,
      'users.email': userEmail
    }, {
      $set: {
		    'users.$.hierarchy': hierarchy,
	    },
    });
  }
});

export const shareTeam = new ValidatedMethod({
  name: 'Teams.methods.share',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    hierarchy: { type: String, allowedValues: [
      'sistemas',
      'creativo',
      'director creativo',
      'director de cuentas',
      'coordinador',
      'administrador',
      'medios',
    ] },
    teamId: { type: String },
  }).validator(),
  run({ email, hierarchy, teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.share.notLoggedIn',
      'Must be logged in to edit a team.');
    }
    let team = Teams.findOne(teamId);
    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.share.notAllowed',
      "The user is not allowed to share the team");
    }
    let user = { email, hierarchy };

    Teams.addUser(teamId, user);
    if (Meteor.users.findByEmail(email, {})) {
      //if user is not registered in Diamond Cloud
      Mail.sendMail({
        from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
        to: email,
        subject: 'Te invitaron a colaborar en Diamond Cloud',
        html: Mail.messages.sharedTeamRegistered(teamId),
      });
    } else {
      Mail.sendMail({
        from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
        to: email,
        subject: 'Te invitaron a colaborar en Diamond Cloud',
        html: Mail.messages.sharedTeamNotRegistered(teamId),
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
    let user = Meteor.users.findByEmail(email, {});
    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.removeUser.notAllowed',
      "The user is not allowed to remove a user from the team");
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
    // Verify user is allowed to archive team
    let team = Teams.findOne(teamId);
    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.archive.notAllowed',
      "The user is not allowed to archive the team");
    }

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

    // Verify user is allowed to dearchive the team
    let team = Teams.findOne(teamId);
    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.dearchive.notAllowed',
      "The user is not allowed to dearchive the team");
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
