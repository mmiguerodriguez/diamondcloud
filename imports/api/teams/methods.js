import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';
import  Future             from 'fibers/future';

import { Teams }           from './teams';
import { Mail }            from '../mails/mails';
import { Boards }          from '../boards/boards';
import { Messages }        from '../messages/messages';
import { DirectChats }     from '../direct-chats/direct-chats';
import { createBoard }     from '../boards/methods';

export const createTeam = new ValidatedMethod({
  name: 'Teams.methods.create',
  validate: new SimpleSchema({
    name: { type: String },
    plan: { type: String, allowedValues: ['free', 'premium'] },
    type: { type: String, min: 0, max: 200 },
    users: { type: [Object], optional: true }, // [{ email, hierarchy }]
    'users.$.email': { type: String },
    'users.$.hierarchy': {
      type: String,
      allowedValues: [
        'sistemas',
        'creativo',
        'director creativo',
        'director de cuentas',
        'coordinador',
        'administrador',
        'medios',
      ],
    },
    url: { type: String },
  }).validator(),
  run({ name, plan, type, users, url }) {
    if (users) {
      if (!Meteor.user()) {
        throw new Meteor.Error('Teams.methods.create.notLoggedIn',
        'Must be logged in to make a team.');
      }
    }

    const team = {
      name,
      plan,
      type,
      boards: [],
      users: [],
      url,
      archived: false,
    };
    let teamId;

    if (users) {
      team.users.push({
        email: Meteor.user().email(),
        hierarchy: 'sistemas',
      });

      users.forEach(({ email, hierarchy }) => {
        if (email === Meteor.user().email()) {
          throw new Meteor.Error('Teams.methods.create.emailIsActualUser',
          'You can\'t add yourself to a team',
          'user_adds_himself');
        }

        team.users.push({ email, hierarchy });
      });
    }

    const future = new Future();
    Teams.insert(team, (error, result) => {
      if (error) {
        throw new Meteor.Error(error);
      }

      teamId = result;
      team._id = teamId;

      createBoard.call({
        teamId,
        name: 'General',
        type: 'default',
        isPrivate: false,
        visibleForDirectors: false,
        //users: team.users,
      }, (error, result) => {
        if (error) {
          future.throw(error);
        }

        team.boards.push({ _id: result._id });

        if (users) {
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
        }

        future.return(team);
      });
    });

    return future.wait();
  },
});

export const editTeam = new ValidatedMethod({
  name: 'Teams.methods.edit',
  validate: new SimpleSchema({
    teamId: { type: String },
    team: { type: Object },
    'team.name': { type: String, optional: true },
    'team.plan': { type: String, optional: true, allowedValues: ['free', 'premium'] },
    'team.type': { type: String, optional: true },
  }).validator(),
  run({ team, teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.edit.notLoggedIn',
      'Must be logged in to edit a team.');
    }

    Teams.update({ _id: teamId }, {
      $set: team,
    });

    return Teams.findOne(teamId);
  },
});

export const changeUserHierarchy = new ValidatedMethod({
  name: 'Teams.methods.changeUserHierarchy',
  validate: new SimpleSchema({
    teamId: { type: String },
    userEmail: { type: String },
    hierarchy: {
      type: String,
      allowedValues: [
        'sistemas',
        'creativo',
        'director creativo',
        'director de cuentas',
        'coordinador',
        'administrador',
        'medios',
      ],
    },
  }).validator(),
  run({ teamId, userEmail, hierarchy }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.changeUserHierarchy.notLoggedIn',
      'Must be logged in to edit a team.');
    }

    const team = Teams.findOne(teamId);
    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.changeUserHierarchy.notAllowed',
      'The user is not allowed to change the hierarchy of another user.');
    }

    Teams.update({
      _id: teamId,
      'users.email': userEmail,
    }, {
      $set: {
        'users.$.hierarchy': hierarchy,
      },
    });
  },
});

export const shareTeam = new ValidatedMethod({
  name: 'Teams.methods.share',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    hierarchy: {
      type: String,
      allowedValues: [
        'sistemas',
        'creativo',
        'director creativo',
        'director de cuentas',
        'coordinador',
        'administrador',
        'medios',
      ],
    },
    teamId: { type: String },
  }).validator(),
  run({ email, hierarchy, teamId }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Teams.methods.share.notLoggedIn',
      'Must be logged in to edit a team.');
    }

    const team = Teams.findOne(teamId);
    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.share.notAllowed',
      'The user is not allowed to share the team');
    }

    const user = { email, hierarchy };
    Teams.addUser(teamId, user);

    const existingUser = Meteor.users.findByEmail(email, {});
    if (existingUser) {
      // User registered
      Mail.sendMail({
        from: 'Diamond Cloud <no-reply@diamondcloud.tk>',
        to: email,
        subject: 'Te invitaron a colaborar en Diamond Cloud',
        html: Mail.messages.sharedTeamRegistered(teamId),
      });

      team.boards.forEach((boardIdObj) => {
        const board = Boards.findOne(boardIdObj._id);
        if (!board.isPrivate) {
          Boards.addUser(board._id, existingUser._id);
        }
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
  },
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

    if (Meteor.user().email() === email) {
      throw new Meteor.Error('Teams.methods.removeUser.cantRemoveYourself',
      'You can\'t remove yourself from a team.');
    }

    const team = Teams.findOne(teamId);
    const user = Meteor.users.findByEmail(email, {});

    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.removeUser.notAllowed',
      'The user is not allowed to remove a user from the team');
    }

    // Remove user from boards if user exists on the database
    if (user) {
      const boardsIds = user.boards(teamId).fetch().map(board => board._id);

      boardsIds.forEach((boardId) => {
        Boards.removeUser(boardId, user._id);
      });

      const directChatsIds = DirectChats.find({
        'users._id': user._id,
      }).fetch().map(directChat => directChat._id);

      DirectChats.remove({
        'users._id': user._id,
      });

      Messages.remove({
        directChatId: {
          $in: directChatsIds,
        },
      });
    }

    Teams.removeUser(teamId, email);

    return Teams.findOne(teamId);
  },
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
    const team = Teams.findOne(teamId);
    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.archive.notAllowed',
      'The user is not allowed to archive the team');
    }

    Teams.update(teamId, {
      $set: {
        archived: true,
      },
    });

    // Testing purposes
    // may need to change in the future
    return Teams.findOne(teamId);
  },
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
    const team = Teams.findOne(teamId);
    if (!team.userIsCertainHierarchy(Meteor.user().email(), 'sistemas')) {
      throw new Meteor.Error('Teams.methods.dearchive.notAllowed',
      'The user is not allowed to dearchive the team');
    }

    Teams.update(teamId, {
      $set: {
        archived: false,
      },
    });

    // Testing purposes
    // may need to change in the future
    return Teams.findOne(teamId);
  },
});
