import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Future from 'fibers/future';

import { Boards } from './boards.js';
import { Teams } from '../teams/teams.js';

export const createBoard = new ValidatedMethod({
  name: 'Boards.methods.create',
  validate: new SimpleSchema({
    teamId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String, min: 0, max: 200 },
    isPrivate: { type: Boolean },
    users: { type: [Object], optional: true },
    'users.$._id': { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
  }).validator(),
  run({ teamId, name, isPrivate, users }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.createBoard.notLoggedIn',
      'Must be logged in to create a board.');
    }

    let team = Teams.findOne(teamId);
    users = users || [];

    if(users.length > 0 && isPrivate) {
      if (team.hasUser({ _id: Meteor.userId() })) {
        users.push({ _id: Meteor.userId() });
      } else {
        throw new Meteor.Error('Boards.methods.createBoard.userNotInTeam',
        'You cannot add yourself to a board when you are not part of the team.');
      }

      users.forEach((user, index, array) => {
        if (!team.hasUser({ _id: user._id })) {
          throw new Meteor.Error('Boards.methods.createBoard.userNotInTeam',
          'You cannot add people to a board that are not part of the team.');
        }

        array[index].unseen = 0;
      });
    }

    let board = {
      name,
      isPrivate,
      users,
      moduleInstances: [],
      archived: false,
    };

    let future = new Future();
    Boards.insert(board, (err, res) => {
      if(!!err) future.throw(err);

      let boardId = res;
      let _board = Boards.findOne(boardId);

      Teams.update(teamId, {
        $push: {
          boards: { _id: boardId },
        },
      });

      future.return(_board);
    });
    return future.wait();
  }
});

export const archiveBoard = new ValidatedMethod({
  name: 'Boards.methods.archiveBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }){
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.archiveBoard.notLoggedIn',
      'Must be logged in to archive a board.');
    }

    let board;

    Boards.update(_id, {
      $set: {
        archived: true,
      }
    });

    board = Boards.findOne(_id);
    return board;
  },
});

export const dearchiveBoard = new ValidatedMethod({
  name: 'Boards.methods.dearchiveBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }){
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.dearchiveBoard.notLoggedIn',
      'Must be logged in to dearchive a board.');
    }

    let board;

    Boards.update(_id, {
      $set: {
        archived: false,
      }
    });

    board = Boards.findOne(_id);
    return board;
  },
});
