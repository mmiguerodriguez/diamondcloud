import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';
import { printObject }     from '../helpers/print-objects.js';
import Future              from 'fibers/future';

import { Boards }          from './boards.js';
import { Teams }           from '../teams/teams.js';
import { ModuleInstances } from '../module-instances/module-instances.js';

export const createBoard = new ValidatedMethod({
  name: 'Boards.methods.create',
  validate: new SimpleSchema({
    teamId: { type: String, regEx: SimpleSchema.RegEx.Id },
    name: { type: String, min: 0, max: 200 },
    type: { type: String },
    isPrivate: { type: Boolean },
    users: { type: [Object], optional: true },
    'users.$.email': { type: String, regEx: SimpleSchema.RegEx.Email, optional: true },
    visibleForDirectors: { type: Boolean },
  }).validator(),
  run({ teamId, name, type, isPrivate, users, visibleForDirectors }) {
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.createBoard.notLoggedIn',
      'Must be logged in to create a board.');
    }

    let team = Teams.findOne(teamId);
    users = users || [];

    if (isPrivate) {
      users.forEach((user, index, array) => {
        if (!team.hasUser({ email: user.email })) {
          throw new Meteor.Error('Boards.methods.createBoard.userNotInTeam',
          'You cannot add people to a board that are not part of the team.');
        }

        array[index].notifications = 0;
      });
    } else {
      users = [];

      team.users.forEach((user) => {
        users.push({ email: user.email, notifications: 0 });
      });
    }

    let board = {
      name,
      users,
      type,
      isPrivate,
      moduleInstances: [],
      archived: false,
      visibleForDirectors,
    };

    let future = new Future();
    Boards.insert(board, (err, res) => {
      if (!!err) future.throw(err);

      let boardId = res;
      let _board = Boards.findOne(boardId);

      Teams.update(teamId, {
        $push: {
          boards: {
            _id: boardId,
          },
        },
      });

      /**
       * Inserts certain moduleInstances for each type
       * of board.
       *
       * 'Creativos'     -> Task-manager, drive & videocall
       * 'Coordinadores' -> Task-manager
       * 'Directores'    -> Task-manager
       */
      let moduleInstances;
      if (board.type === 'creativos') {
        moduleInstances = [
          { moduleId: 'task-manager', x: 50, y: 20, width: 300, height: 400, archived: false, minimized: false },
          { moduleId: 'drive', x: 50, y: 340, width: 482, height: 400, archived: false, minimized: false },
          { moduleId: 'videocall', x: 50, y: 842, width: 270, height: 290, archived: false, minimized: false },
        ];
      } else if (board.type === 'coordinadores') {
        moduleInstances = [
          { moduleId: 'task-manager', x: 50, y: 20, width: 300, height: 400, archived: false, minimized: false },
        ];
      } else if (board.type === 'directores creativos' || board.type === 'directores de cuentas' || board.type === 'administradores' ||  board.type === 'medios') {
        moduleInstances = [
          { moduleId: 'task-manager', x: 50, y: 20, width: 300, height: 400, archived: false, minimized: false },
          { moduleId: 'drive', x: 50, y: 340, width: 482, height: 400, archived: false, minimized: false },
        ];
      }

      if (!!moduleInstances) {
        ModuleInstances.insertManyInstances(moduleInstances, boardId, (error, result) => {
          if (error) {
            throw new Meteor.Error(error);
          } else {
            future.return(_board);
          }
        });
      }

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

/*
 * @summary Make board visible for directors
 */

export const unlockBoard = new ValidatedMethod({
  name: 'Boards.methods.unlockBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }){
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.unlockBoard.notLoggedIn',
      'Must be logged in to unlock a board.');
    }

    let board;

    Boards.update(_id, {
      $set: {
        visibleForDirectors: true,
      }
    });

    board = Boards.findOne(_id);
    return board;
  },
});

export const lockBoard = new ValidatedMethod({
  name: 'Boards.methods.lockBoard',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ _id }){
    if (!Meteor.user()) {
      throw new Meteor.Error('Boards.methods.lockBoard.notLoggedIn',
      'Must be logged in to lock a board.');
    }

    let board;

    Boards.update(_id, {
      $set: {
        visibleForDirectors: false,
      }
    });

    board = Boards.findOne(_id);
    return board;
  },
});
